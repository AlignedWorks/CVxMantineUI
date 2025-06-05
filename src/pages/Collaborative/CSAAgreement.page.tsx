// src/pages/CSAAgreement.page.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Title, Text, Group, Button, Paper, Modal, Center, Loader } from '@mantine/core';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import { CSADocumentViewer } from '../../components/CSADocumentViewer';
import { IconArrowLeft } from '@tabler/icons-react';

interface CSAData
{
  csaId: number;
  csaUrl: string;
  collabName: string;
}

export function CSAAgreement() {
  const { id } = useParams(); // Collaborative ID
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [csaData, setCsaData] = useState<CSAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  // Determine mode based on userId presence
  const isAcceptanceMode = !!userId;
  
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchCSAData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        new URL(`collaboratives/${id}/CSAAgreement`, import.meta.env.VITE_API_BASE),
        {
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch CSA data");
      
      const data = await response.json();
      console.log(data);
      setCsaData(data);
    } catch (err) {
      console.error("Error fetching CSA data:", err);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchCSAData();
  }, []);

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null);
  }, [id, setCollaborativeId]);
  
  const handleAgreementComplete = () => {
    setHasAgreed(true);
  };
  
  const CSAfeedback = {
    csaId: csaData?.csaId || 0,
    userId: userId || "",
    csaAcceptedStatus: hasAgreed,
  }

  const confirmAgreement = async () => {
    try {
      // Send agreement confirmation to API
      const response = await fetch(
        new URL(`collaboratives/${id}`, import.meta.env.VITE_API_BASE),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(CSAfeedback),
        }
      );
      
      if (!response.ok) throw new Error("Failed to record agreement");
      
      // Navigate back to collaborative home
      navigate(`/collaboratives/${id}`);
    } catch (error) {
      console.error("Error confirming agreement:", error);
    }
  };
  
  return (
    <Container size="md" py="xl">
      <Link 
        to= {isAcceptanceMode ? '/dashboard' : `/collaboratives/${id}`}
        style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <IconArrowLeft size={16} style={{ marginRight: '5px' }} />
        <Text>Back</Text>
      </Link>
      {isAcceptanceMode && (
        <Title order={2} mb="lg">{csaData?.collabName}</Title>
      )}
      <Title order={2} mb="lg">Collaborative Service Agreement</Title>

      <Text mb="lg">
        {isAcceptanceMode 
          ? 'Please read the entire document carefully before agreeing to the terms to become an active member.'
          : 'Review the Collaborative Service Agreement document below.'
        }
      </Text>
      
      <Paper withBorder>
        {loading ? (
          <Center p="xl">
            <Loader size="lg" />
            <Text ml="md">Loading document...</Text>
          </Center>
        ) : csaData?.csaUrl ? (
          <CSADocumentViewer 
            documentUrl={csaData?.csaUrl || ""}
            onAgreementComplete={handleAgreementComplete}
          />
        ) : (
          <Center p="xl">
            <Text c="red">No document URL available</Text>
          </Center>
        )}
      </Paper>
      
      {isAcceptanceMode && (
        <>
          <Button
            mt="xl"
            disabled={!hasAgreed}
            onClick={() => setShowConfirmation(true)}
          >
            I Agree to the Terms and Conditions
          </Button>
          
          <Modal
            opened={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            title="Confirm Agreement"
          >
            <Text>
              By clicking "Confirm", you acknowledge that you have read, understood, 
              and agree to be bound by the Collaborative Service Agreement.<br/>
            </Text>
            <Group justify="flex-start" mt="md">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmAgreement}>Confirm</Button>
            </Group>
          </Modal>
        </>
      )}
    </Container>
  );
}