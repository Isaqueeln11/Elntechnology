import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function IniciarProjeto() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'iot',
    descricao: '',
    orcamento: '',
    prazo: '',
    empresa: '',
    email: '',
    telefone: '',
    anexos: [] as File[],
    objetivos: '',
    requisitos: '',
    dataCriacao: new Date(),
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const formatCurrency = (value: string) => {
    return (
      'R$ ' +
      value
        .replace(/\D/g, '')
        .replace(/(\d)(\d{2})$/, '$1,$2')
        .replace(/(?=(\d{3})+(\D))\B/g, '.')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      setEnviando(true);
      // Remove the anexos field as File objects can't be stored in Firestore
      const { anexos, orcamento, ...formDataWithoutFiles } = formData;
      const formDataToSend = {
        ...formDataWithoutFiles,
        orcamento: orcamento.replace('R$ ', ''),
      };

      // Add the document to Firestore
      await addDoc(collection(db, 'projetos'), formDataToSend);

      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar projeto:', error);
      alert('Ocorreu um erro ao enviar o projeto. Por favor, tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'orcamento' ? formatCurrency(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        anexos: [...prev.anexos, ...Array.from(e.target.files || [])],
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <span className="ml-2 text-white font-medium">
                    Informações Básicas
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center mr-2">
                    2
                  </div>
                  <div className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center">
                    3
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Digite o nome do seu projeto"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Tipo de Projeto
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="iot">IoT</option>
                  <option value="robotica">Robótica</option>
                  <option value="automacao">Automação</option>
                  <option value="educacional">Educacional</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Descreva seu projeto"
                  required
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-2">
                    2
                  </div>
                  <span className="text-white font-medium">
                    Detalhes do Projeto
                  </span>
                </div>
                <div className="w-8 h-8 border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-400">
                  3
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Objetivos do Projeto
                </label>
                <textarea
                  name="objetivos"
                  value={formData.objetivos}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Quais são os principais objetivos do seu projeto?"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Requisitos Específicos
                </label>
                <textarea
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-32"
                  placeholder="Liste os requisitos específicos do projeto"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Prazo Desejado
                </label>
                <input
                  type="text"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ex: 3 meses"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Orçamento Estimado
                </label>
                <input
                  type="text"
                  name="orcamento"
                  value={formData.orcamento}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="R$ 0,00"
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <span className="ml-2 text-white font-medium">
                    Informações de Contato
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Nome da sua empresa"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Anexos (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="anexos"
                  />
                  <label
                    htmlFor="anexos"
                    className="w-full bg-gray-800 border border-dashed border-gray-600 rounded-lg px-4 py-8 text-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Clique para adicionar arquivos</span>
                    <span className="text-sm">ou arraste e solte aqui</span>
                  </label>
                </div>
                {formData.anexos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.anexos.map((file, index) => (
                      <div key={index} className="text-sm text-gray-400">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-300 hover:text-white mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Iniciar Projeto</h1>

        {enviado ? (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Proposta Enviada!
            </h2>
            <p className="text-green-400">
              Recebemos sua proposta com sucesso. Nossa equipe entrará em
              contato em breve para discutir os próximos passos.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 rounded-xl p-8"
          >
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Voltar
                </button>
              )}
              <button
                type="submit"
                disabled={enviando}
                className={`ml-auto ${
                  enviando
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-semibold px-8 py-2 rounded-lg transition-colors`}
              >
                {enviando
                  ? 'Enviando...'
                  : step === 3
                  ? 'Enviar Proposta'
                  : 'Próximo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
