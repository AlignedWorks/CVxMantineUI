// src/pages/CSAAgreement.page.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Group, Button, Paper, Modal } from '@mantine/core';
import { CSADocumentViewer } from '../../components/CSADocumentViewer';

export function CSAAgreement() {
  const { id } = useParams(); // Collaborative ID
  const navigate = useNavigate();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
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
      <Title order={2} mb="lg">Collaborative Service Agreement</Title>
      <Text mb="lg">
        Please read the entire document carefully before agreeing to the terms.
      </Text>
      
      <Paper withBorder>
        <CSADocumentViewer 
          documentUrl={`${import.meta.env.VITE_API_BASE}/collaboratives/${id}/csa-document`}
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
          and agree to be bound by the Collaborative Service Agreement.
        </Text>
        <Group justify="flex-start" mt="md">
          <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={confirmAgreement}>Confirm</Button>
        </Group>
      </Modal>
    </Container>
  );
}