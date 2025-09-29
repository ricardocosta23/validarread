import WebhookLogTable from '../WebhookLogTable';

export default function WebhookLogTableExample() {
  // todo: remove mock functionality
  const mockLogs = [
    {
      id: '1',
      boardId: '7549606370',
      itemId: '12345',
      numeroOpcao: '1',
      opc1a: 'Option 1A Value',
      opc2a: null,
      opc3a: null,
      opc4a: null,
      validationResult: 'OK',
      processedAt: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      boardId: '7549606370',
      itemId: '12346',
      numeroOpcao: '2',
      opc1a: null,
      opc2a: null,
      opc3a: null,
      opc4a: null,
      validationResult: 'NÃO READEQUAR',
      processedAt: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '3',
      boardId: '7549606370',
      itemId: '12347',
      numeroOpcao: '4',
      opc1a: null,
      opc2a: null,
      opc3a: null,
      opc4a: 'Option 4A Data',
      validationResult: 'OK',
      processedAt: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];

  return <WebhookLogTable logs={mockLogs} />;
}