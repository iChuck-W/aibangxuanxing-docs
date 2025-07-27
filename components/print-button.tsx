'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: '8px 16px',
        background: '#2F88FF',
        color: 'white',
        border: '10',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '20px',
        marginTop: '-100px',
      }}
    >
      🖨️ 保存为 PDF
    </button>
  );
}
