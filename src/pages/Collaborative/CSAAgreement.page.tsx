// src/pages/CSAAgreement.page.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container, Title, Text, Group, Button, Paper, Modal } from '@mantine/core';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import { CSADocumentViewer } from '../../components/CSADocumentViewer';
import { IconArrowLeft } from '@tabler/icons-react';

interface CSAData
{
  csaId: number;
  csaUrl: string;
}

export function CSAAgreement() {
  const { id } = useParams(); // Collaborative ID
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [csaData, setCsaData] = useState<CSAData | null>(null);
  const [searchParams] = useSearchParams();
  const docUrl = searchParams.get('docUrl');
  const userId = searchParams.get('userId');
  
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchCSAData = () => {
    fetch(
      new URL(`collaboratives/${id}/CSAAgreement`, import.meta.env.VITE_API_BASE),
    {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {

        console.log(data);
        setCsaData(data); // Set the collab invites data
        console.log("CSA Data fetched successfully:", csaData);

      })
      .catch((err) => console.error("Error fetching CSA data:", err));
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
  
  const confirmAgreement = async () => {
    try {
      // Send agreement confirmation to API
      const response = await fetch(
        new URL(`collaboratives/${id}/members/agreement`, import.meta.env.VITE_API_BASE),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        to={`/collaboratives/${id}`} 
        style={{ textDecoration: 'none', color: '#0077b5', display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <IconArrowLeft size={16} style={{ marginRight: '5px' }} />
        <Text>Back</Text>
      </Link>
      <Title order={2} mb="lg">Collaborative Service Agreement</Title>
      <Text mb="lg">
        Please read the entire document carefully before agreeing to the terms.<br/>
        {userId}
      </Text>
      
      <Paper withBorder>
        <CSADocumentViewer 
          documentUrl={docUrl || '/default-csa.pdf'} // Fallback URL if none provided
          onAgreementComplete={handleAgreementComplete}
        />
      </Paper>
      
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
          User Id: {userId}<br/>
          Collaborative Id: {id}
        </Text>
        <Group justify="flex-start" mt="md">
          <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={confirmAgreement}>Confirm</Button>
        </Group>
      </Modal>
    </Container>
  );
}