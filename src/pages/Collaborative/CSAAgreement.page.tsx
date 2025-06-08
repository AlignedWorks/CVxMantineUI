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
  
  const [hasReadDoc, setHasReadDoc] = useState(false);
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
    setHasReadDoc(true);
  };
  
  const CSAfeedback = {
    csaId: csaData?.csaId || 0,
    userId: userId || "",
    csaAcceptedStatus: "NotAccepted",
  }

  const confirmAgreement = async () => {
    try {

      CSAfeedback.csaAcceptedStatus = "Accepted";

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

  const declineAgreement = async () => {
    try {
      
      CSAfeedback.csaAcceptedStatus = "Declined";

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
      <Title order={2} mb="lg">
        {csaData?.collabName} <span style={{ color: 'grey' }}>Collaborative Sharing Agreement</span>
      </Title>

      {isAcceptanceMode &&
        <Text mb="lg">
          Please read the entire document carefully before agreeing to the terms to become an active member.
        </Text>
      }
      
      <Paper withBorder>
        {loading ? (
          <Center p="xl">
            <Loader size="lg" />
            <Text ml="md">Loading document...</Text>
          </Center>
        ) : csaData?.csaUrl ? (
          <CSADocumentViewer 
            documentUrl={csaData?.csaUrl || ""}
            allPagesRead={handleAgreementComplete}
          />
        ) : (
          <Center p="xl">
            <Text c="red">No document URL available</Text>
          </Center>
        )}
      </Paper>
      
      {isAcceptanceMode && (
        <>
          <Group gap="md">
            <Button
              mt="xl"
              variant="outline"
              disabled={!hasReadDoc}
              onClick={() => setShowConfirmation(true)}
            >
              I accept this Collaborative Sharing Agreement
            </Button>
            <Button
              mt="xl"
              variant="outline"
              color="red"
              disabled={!hasReadDoc}
              onClick={() => declineAgreement()}
            >
              I decline this Collaborative Sharing Agreement
            </Button>
          </Group>
          
          <Modal
            opened={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            title="Confirm Agreement"
          >
            <Text>
              By clicking "Confirm", you acknowledge that you have read, understood, 
              and agree to be bound by the Collaborative Sharing Agreement.<br/>
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