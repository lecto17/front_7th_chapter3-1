import React from 'react';

interface UserPostSelectorProps {
  selected: 'user' | 'post';
  onSelect: (type: 'user' | 'post') => void;
}

export const UserPostSelector: React.FC<UserPostSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        borderBottom: '2px solid #ccc',
        paddingBottom: '5px'
      }}
    >
      <button
        onClick={() => onSelect('post')}
        style={{
          padding: '8px 16px',
          marginRight: '5px',
          fontSize: '14px',
          fontWeight: selected === 'post' ? 'bold' : 'normal',
          border: '1px solid #999',
          background: selected === 'post' ? '#1976d2' : '#f5f5f5',
          color: selected === 'post' ? 'white' : '#333',
          cursor: 'pointer',
          borderRadius: '3px'
        }}
      >
        게시글
      </button>
      <button
        onClick={() => onSelect('user')}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: selected === 'user' ? 'bold' : 'normal',
          border: '1px solid #999',
          background: selected === 'user' ? '#1976d2' : '#f5f5f5',
          color: selected === 'user' ? 'white' : '#333',
          cursor: 'pointer',
          borderRadius: '3px'
        }}
      >
        사용자
      </button>
    </div>
  );
};
