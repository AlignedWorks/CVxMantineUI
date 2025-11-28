import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCollaborativeContext } from '../../CollaborativeContext.tsx';
import {
  Container,
  Text,
  Button,
  Loader,
  Paper,
  Title,
  SimpleGrid,
  Group,
  NumberInput,
} from '@mantine/core';
import { CollaborativeDataTreasury } from '../../data.ts';

export function EditCollaborativeTreasury() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCollaborativeId } = useCollaborativeContext();
  const [collaborative, setCollaborative] = useState<CollaborativeDataTreasury | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  type TreasuryForm = {
    tokensCreated: number;
    tokenValue: number;
    tokensPriorWorkPercent: number;
    tokenReleaseRate: number;
    launchCyclePeriodWeeks: number;
    tokenSecondReleaseWeeks: number;
    collabAdminCompensationPercent: number;
  };

  // Form values
  const [formValues, setFormValues] = useState<TreasuryForm>({
    tokensCreated: 10000,
    tokenValue: 0,
    tokensPriorWorkPercent: 0,
    tokenReleaseRate: 0,
    launchCyclePeriodWeeks: 12,
    tokenSecondReleaseWeeks: 0,
    collabAdminCompensationPercent: 0,
  });

  type FormErrors = Partial<Record<keyof TreasuryForm, string>>;

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Set the collaborative ID in context
  useEffect(() => {
    setCollaborativeId(id || null);
    return () => setCollaborativeId(null);
  }, [id, setCollaborativeId]);

  useEffect(() => {
    fetch(
      `/api/collaboratives/${id}/treasury`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch collaborative data');
        }
        return response.json();
      })
      .then((data: CollaborativeDataTreasury) => {
        setCollaborative(data);
        setFormValues({
          collabAdminCompensationPercent: data.collabAdminCompensationPercent,
          launchCyclePeriodWeeks: data.launchCyclePeriodWeeks || 12,
          tokenReleaseRate: data.tokenReleaseRate,
          tokenSecondReleaseWeeks: data.tokenSecondReleaseWeeks,
          tokensCreated: data.tokensCreated || 0,
          tokensPriorWorkPercent: data.tokensPriorWorkPercent || 0,
          tokenValue: data.tokenValue || 0,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const formatNumber = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const numTokensSetAsideForPriorWork = Math.round((formValues.tokensPriorWorkPercent / 100) * (formValues.tokensCreated || 0));

  // compute first three cycle balances (start of each cycle) using decay = (1 - releaseRate)
  const releaseCyclesPreview: React.ReactNode = (() => {
    const created = Math.max(0, Math.round(formValues.tokensCreated - numTokensSetAsideForPriorWork || 0));
    const rate = Math.max(0, Math.min(100, formValues.tokenReleaseRate || 0)) / 100;

    const first = Math.round(created * rate);
    const second = Math.round(first * (1 - rate));
    const third = Math.round(second * (1 - rate));

    const cycles = [first, second, third];
    const ord = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');

    return (
      <>
        # tokens&nbsp;
        {cycles.map((v, i) => (
          <span key={i}>
            {i + 1}{ord(i + 1)} cycle:&nbsp;<strong>{formatNumber(v)}</strong>{i < cycles.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    );
  })();

  // compute admin payouts for the first three cycles based on collabAdminCompensationPercent
  const adminPaymentsPreview: React.ReactNode = (() => {
    const compPct = Math.max(0, Math.min(100, formValues.collabAdminCompensationPercent || 0)) / 100;
    if (compPct === 0) return '';

    const created = Math.max(0, Math.round(formValues.tokensCreated - numTokensSetAsideForPriorWork || 0));
    const rate = Math.max(0, Math.min(100, formValues.tokenReleaseRate || 0)) / 100;

    const first = Math.round(created * rate);
    const second = Math.round(first * (1 - rate));
    const third = Math.round(second * (1 - rate));

    const adminFirst = Math.round(first * compPct);
    const adminSecond = Math.round(second * compPct);
    const adminThird = Math.round(third * compPct);

    const ord = (n: number) => (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
    const arr = [adminFirst, adminSecond, adminThird];

    return (
      <>
        # tokens&nbsp;
        {arr.map((v, i) => (
          <span key={i}>
            {i + 1}{ord(i + 1)} cycle:&nbsp;<strong>{formatNumber(v)}</strong>{i < arr.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    );
  })();

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Loader size="lg" />
      </Container>
    );
  }

  if (!collaborative || !formValues) {
    return (
      <Container size="md" py="xl">
        <Text size="lg" c="red">
          Collaborative not found.
        </Text>
      </Container>
    );
  }

  const handleFormChange = (field: keyof typeof formValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `/api/collaboratives/${id}/treasury`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update treasury data');
      }

      // Navigate back to treasury page on success
      navigate(`/collaboratives/${id}/treasury`);
    } catch (error) {
      console.error('Error updating treasury data:', error);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/collaboratives/${id}/treasury`);
  };

  return (
    <Container size="md" py="xl">
      {/* Back Link */}
      <Link to={`/collaboratives/${id}/treasury`} style={{ textDecoration: 'none', color: '#0077b5' }}>
        &larr; Back
      </Link>
      
      <Paper p="lg" withBorder mt="md">
        <Title order={2} mb="xl">
          Edit Treasury
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
          <NumberInput
            label="Tokens Created"
            placeholder="Enter the number of tokens created (default: 10,000)"
            value={formValues.tokensCreated}
            onChange={(value) =>
              handleFormChange('tokensCreated', value)
            }
            error={formErrors.tokensCreated} // Display validation error
            required
            step={100}
            thousandSeparator=","
            allowNegative={false}
            mb="md"
          />
  
          <div>
            <NumberInput
              label="Current Token Price"
              placeholder="Enter the current token price in USD (e.g., 1.00), this is optional"
              value={formValues.tokenValue}
              onChange={(value) =>
                handleFormChange('tokenValue', value)
              }
              error={formErrors.tokenValue} // Display validation error

              min={0}
              prefix="$"
              decimalScale={2}
              allowNegative={false}
              mb="xs" 
            />
            <Text size="sm" c="dimmed" mb="md">
              {`Token Pool Value: $${(formValues.tokenValue * formValues.tokensCreated).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}`}
            </Text>
          </div>
        </SimpleGrid>
  
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
          <div>
            <NumberInput
              label="Reserved Launch Tokens"
              placeholder="Tokens set aside to pay for work completed prior to the creation of this Collaborative"
              value={formValues.tokensPriorWorkPercent }
              onChange={(value) =>
                handleFormChange('tokensPriorWorkPercent', value)
              }
              min={0}
              max={100}
              suffix="%"
              decimalScale={2}
              mb="xs"
            />
            <Text size="sm" c="dimmed" mb="md">
              # tokens: {formValues.tokensPriorWorkPercent > 0 ? `${((formValues.tokensPriorWorkPercent / 100) * formValues.tokensCreated).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}` : 0}
            </Text>
          </div>
  
          <div>
            <NumberInput
              label="Token Release Rate"
              placeholder="Enter the release rate percentage (default: 10%)"
              value={formValues.tokenReleaseRate}
              onChange={(value) =>
                handleFormChange('tokenReleaseRate', value)
              }
              error={formErrors.tokenReleaseRate} // Display validation error
              required
              min={0}
              max={100}
              suffix="%"
              decimalScale={2}
              mb="xs"
            />
            <Text size="sm" c="dimmed" mb="md">
              {releaseCyclesPreview}
            </Text>
          </div>
        </SimpleGrid>
  
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
          <NumberInput
            label="Launch Cycle Period (weeks)"
            placeholder="Enter the cycle period in weeks (default: 12)"
            value={formValues.launchCyclePeriodWeeks}
            onChange={(value) =>
              handleFormChange('launchCyclePeriodWeeks', value)
            }
            error={formErrors.launchCyclePeriodWeeks} // Display validation error
            required
            allowNegative={false}
            mb="md"
          />
  
          <div>
            <NumberInput
              label="Second Release (weeks)"
              placeholder="Enter weeks (0 = at approval)"
              value={formValues.tokenSecondReleaseWeeks}
              onChange={(value) =>
                handleFormChange('tokenSecondReleaseWeeks', value)
              }
              error={formErrors.tokenSecondReleaseWeeks} // Display validation error
              required
              mb="xs"
              allowNegative={false}
            />
            <Text size="sm" c="dimmed" mb="md">
              # weeks after collab approval (0 = at approval)
            </Text>
          </div>
        </SimpleGrid>
  
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }}>
          <div>
            <NumberInput
              label="Collab Admin Pay"
              placeholder="Percentage of each release cycle allocated to the collaborative admin (default: 0%)"
              value={formValues.collabAdminCompensationPercent}
              onChange={(value) =>
                handleFormChange('collabAdminCompensationPercent', value)
              }
              required
              min={0}
              max={100}
              suffix="%"
              decimalScale={2}
              mb="xs"
            />
            <Text size="sm" c="dimmed" mb="md">
              {adminPaymentsPreview
                ? <>{adminPaymentsPreview}</>
                : 'Percentage of tokens released to the collaborative admin every cycle as compensation'}
            </Text>
          </div>
          <div>
            {/* empty placeholder to reserve the second column so widths match */}
          </div>
        </SimpleGrid>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit} 
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}