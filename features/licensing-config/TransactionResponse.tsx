import React from 'react';

interface TransactionResponseProps {
  response: string;
}

export const TransactionResponse: React.FC<TransactionResponseProps> = ({ response }) => {
  return (
    <div className="flex-1 mt-6">
      <h3 className="text-xl font-bold text-black border-b border-[#09ACFF] pb-2 mb-4">Response</h3>
      <div className="bg-black p-4 rounded-md h-[350px] overflow-y-auto">
        <pre className="text-[#A1D1FF] font-mono">
          <code>{response || "// Waiting for transaction execution..."}</code>
        </pre>
      </div>
    </div>
  );
};
