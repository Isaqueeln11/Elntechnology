export type StoreProduct = {
  id: string;
  page?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  status?: string;
  price?: string;
  currency?: 'BRL' | 'USD';
  marketplace?: string;
  category?: string;
  imageUrl?: string;
  availability?: string;
  featured?: boolean;
  sku?: string;
  specifications?: string;
  features?: string;
  datasheetUrl?: string;
};

export function formatStorePrice(product: StoreProduct) {
  const rawPrice = (product.price || '').trim();

  if (!rawPrice) return 'Consulte o valor';
  if (/^(R\$|US\$|USD|BRL)/i.test(rawPrice)) return rawPrice;
  if (/orcamento|orçamento|consulte|sob consulta|personalizado/i.test(rawPrice)) return rawPrice;

  const currency = product.currency || 'BRL';
  return currency === 'USD' ? `US$ ${rawPrice}` : `R$ ${rawPrice}`;
}

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
    id: 'sample-esp32-s3',
    page: 'lojas',
    type: 'Produto',
    title: 'ESP32-S3 Super Mini',
    description: 'Placa compacta com Wi-Fi e Bluetooth para dispositivos conectados, protótipos e automações.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20saber%20sobre%20a%20ESP32-S3%20Super%20Mini',
    status: 'Publicado',
    price: 'A partir de R$ 59,90',
    category: 'Placas e módulos',
    availability: 'Sob consulta',
    featured: true,
    sku: 'ELN-ESP32-S3-MINI',
    specifications: 'Processador: ESP32-S3 dual-core\nConectividade: Wi-Fi + Bluetooth LE\nInterface: USB-C\nMemória flash: 4 MB',
    features: 'Formato compacto\nIdeal para IoT\nProgramação via USB-C\nCompatível com Arduino IDE',
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf',
  },
  {
    id: 'sample-ota-controller',
    page: 'lojas',
    type: 'Produto',
    title: 'Controlador ELN com atualização OTA',
    description: 'Controlador conectado preparado para receber novas versões de firmware remotamente.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20um%20controlador%20com%20atualização%20OTA',
    status: 'Publicado',
    price: 'A partir de R$ 389,00',
    category: 'IoT e automação',
    availability: 'Sob encomenda',
    featured: true,
    sku: 'ELN-CTRL-OTA',
    specifications: 'Conectividade: Wi-Fi\nAtualização: OTA segura\nPainel: Monitoramento web\nFirmware: Personalizado',
    features: 'Atualização remota\nControle de versão\nPainel administrativo\nConfiguração sob medida',
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
  {
    id: 'sample-installation',
    page: 'lojas',
    type: 'Serviço',
    title: 'Instalação e configuração técnica',
    description: 'Instalação, configuração inicial, testes e orientação para equipamentos e sistemas ELN.',
    url: 'https://wa.me/5581997092380?text=Olá,%20quero%20solicitar%20instalação%20e%20configuração',
    status: 'Publicado',
    price: 'Orçamento personalizado',
    category: 'Suporte técnico',
    availability: 'Agendamento disponível',
    sku: 'ELN-SUP-INSTALL',
    specifications: 'Atendimento: Sob agendamento\nTestes: Funcionamento e conectividade\nConfiguração: Conforme projeto\nEntrega: Orientação de uso',
    features: 'Instalação organizada\nConfiguração inicial\nValidação técnica\nSuporte pós-entrega',
  },
];
