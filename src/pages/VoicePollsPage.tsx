import { useState } from 'react';
import { Vote, TrendingUp, Users, BarChart2 } from 'lucide-react';
import { useData, useAuth, useToast } from '../contexts';
import { Poll } from '../contexts/DataContext';

export default function VoicePollsPage() {
  const { polls, manifestoPoll, votePoll, changeVote } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleVote = (pollId: string, optionId: string) => {
    if (!user) {
      showToast('Please login to vote', 'error');
      return;
    }
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    if (poll.votedBy.includes(user.id)) {
      changeVote(pollId, optionId);
      showToast('Vote updated!', 'success');
    } else {
      votePoll(pollId, optionId);
      showToast('Vote recorded!', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Voice Polls</h1>
        <p className="text-text-secondary">Make your voice heard. Vote on issues that matter.</p>
      </div>

      <PollCard poll={manifestoPoll} currentUserId={user?.id} onVote={(optionId) => handleVote(manifestoPoll.id, optionId)} isManifesto />

      <div className="space-y-6 mt-8">
        <h2 className="text-xl font-bold text-text-primary">Active Polls</h2>
        {polls.filter(p => p.id !== 'manifesto-poll').map(poll => (
          <PollCard key={poll.id} poll={poll} currentUserId={user?.id} onVote={(optionId) => handleVote(poll.id, optionId)} />
        ))}
      </div>
    </div>
  );
}

function PollCard({ poll, currentUserId, onVote, isManifesto }: { poll: Poll; currentUserId?: string; onVote: (optionId: string) => void; isManifesto?: boolean }) {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userVote = poll.options.find(opt => opt.votedBy.includes(currentUserId || ''));

  return (
    <div className={`card ${isManifesto ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-primary">{poll.question}</h2>
        </div>
        {isManifesto && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium animate-pulse">LIVE</span>}
      </div>

      <p className="text-text-muted text-sm mb-4">
        <Users className="w-4 h-4 inline mr-1" />
        {totalVotes.toLocaleString()} total votes
      </p>

      <div className="space-y-3">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = option.votedBy.includes(currentUserId || '');
          const isUserChoice = userVote?.id === option.id;

          return (
            <div key={option.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-primary text-sm font-medium">{option.label}</span>
                <span className="text-primary font-bold text-sm">{percentage}%</span>
              </div>
              <div className="relative h-12 bg-dark-bg rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ${
                    isSelected || isUserChoice
                      ? 'bg-gradient-to-r from-primary to-primary-hover'
                      : 'bg-dark-hover'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                <button
                  onClick={() => onVote(option.id)}
                  className={`absolute inset-0 flex items-center justify-end pr-3 transition-colors ${
                    isUserChoice ? 'text-dark-bg font-bold' : 'text-text-muted hover:text-primary'
                  }`}
                >
                  {isUserChoice ? '✓ Your Vote' : `Vote (${option.votes.toLocaleString()})`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {userVote && (
        <p className="text-green-400 text-sm mt-4">
          You voted for: {userVote.label}
        </p>
      )}
    </div>
  );
}
