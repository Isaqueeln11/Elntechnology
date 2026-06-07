export type StoreProduct = {
  id: string;
  page?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  status?: string;
  price?: string;
  category?: string;
  imageUrl?: string;
  availability?: string;
  featured?: boolean;
  sku?: string;
  specifications?: string;
  features?: string;
  datasheetUrl?: string;
};

export const sampleStoreProducts: StoreProduct[] = [
  {
    id: 'sample-iot',
    page: 'lojas',
    type: 'Produto',
    title: 'Kit IoT ESP32 para automação',
    description: 'Controlador com ESP32 para protótipos, sensores, acionamentos e projetos conectados.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20saber%20sobre%20o%20Kit%20IoT%20ESP32',
    status: 'Publicado',
    price: 'A partir de R$ 249,00',
    category: 'IoT e automação',
    availability: 'Sob encomenda',
    featured: true,
    sku: 'ELN-IOT-ESP32',
    specifications: 'Processador: ESP32\nConectividade: Wi-Fi + Bluetooth\nAlimentação: USB 5V\nFirmware: Atualização OTA',
    features: 'Controle de sensores e atuadores\nPainel web responsivo\nFirmware preparado para evolução\nSuporte técnico ELN Technology',
  },
  {
    id: 'sample-pcb',
    page: 'lojas',
    type: 'Serviço',
    title: 'Projeto de PCB personalizada',
    description: 'Desenvolvimento de placa eletrônica, revisão de circuito, documentação e preparação para fabricação.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20um%20orçamento%20de%20PCB%20personalizada',
    status: 'Publicado',
    price: 'Orçamento personalizado',
    category: 'Eletrônica e PCB',
    availability: 'Sob encomenda',
    sku: 'ELN-PCB-CUSTOM',
    specifications: 'Entrega: Esquemático e layout\nArquivos: Gerber e documentação\nRevisão: Elétrica e fabricação\nFormato: Projeto sob medida',
    features: 'Análise da necessidade\nSeleção de componentes\nPreparação para fabricação\nDocumentação técnica',
  },
  {
    id: 'sample-3d',
    page: 'lojas',
    type: 'Serviço',
    title: 'Impressão 3D e protótipo',
    description: 'Modelagem, impressão 3D, ajustes de encaixe e protótipos para projetos de tecnologia.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20saber%20sobre%20impressão%203D',
    status: 'Publicado',
    price: 'A partir de R$ 35,00',
    category: 'Impressão 3D',
    availability: 'Disponível',
    sku: 'ELN-3D-PROTOTIPO',
    specifications: 'Material: Conforme aplicação\nModelagem: Opcional\nAcabamento: Sob consulta\nPrazo: Conforme complexidade',
    features: 'Protótipos funcionais\nCaixas para eletrônica\nSuportes personalizados\nAjustes de encaixe',
  },
];
