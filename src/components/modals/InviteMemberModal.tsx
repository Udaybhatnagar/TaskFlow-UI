import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/hooks/useProjects';
import toast from 'react-hot-toast';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, projectId }) => {
  const { addMember } = useProjects();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await addMember(projectId, { email: email.trim(), role });
      setEmail('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? (err as any)?.response?.data?.message || err.message : 'Failed to add member';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-400">Enter the email address of the person you want to invite. They must already have an account.</p>
        <Input
          id="invite-email"
          label="Email Address"
          type="email"
          placeholder="colleague@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Select
          id="invite-role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[{ value: 'member', label: 'Member' }, { value: 'admin', label: 'Admin' }]}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Send Invite</Button>
        </div>
      </form>
    </Modal>
  );
};
