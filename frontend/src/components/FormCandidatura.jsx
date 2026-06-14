import React, { useState } from 'react';

export default function FormCandidatura({
  medicoId,
  plantoes,
  cadastrarCandidatura,
  carregando
}) {
  const [plantaoId, setPlantaoId] = useState('');

  const plantoesDisponiveis = plantoes.filter(
    (plantao) => plantao.status === 'Disponível'
  );

  async function enviarFormulario(evento) {
    evento.preventDefault();

    const operacaoRealizada =
      await cadastrarCandidatura({
        medicoId: Number(medicoId),
        plantaoId: Number(plantaoId)
      });

    if (operacaoRealizada) {
      setPlantaoId('');
    }
  }

  function formatarData(data) {
    if (!data) {
      return '';
    }

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }

  return (
    <form
      onSubmit={enviarFormulario}
      style={{
        border: '1px solid #cccccc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}
    >
      <h2>Nova candidatura</h2>

      {plantoesDisponiveis.length === 0 ? (
        <p>Não existem plantões disponíveis.</p>
      ) : (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="plantaoId">
              Plantão
            </label>

            <br />

            <select
              id="plantaoId"
              value={plantaoId}
              onChange={(evento) =>
                setPlantaoId(evento.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">
                Selecione um plantão
              </option>

              {plantoesDisponiveis.map((plantao) => (
                <option
                  key={plantao.id}
                  value={plantao.id}
                >
                  {formatarData(plantao.data)}
                  {' às '}
                  {plantao.horario}
                  {' — '}
                  {Number(plantao.valor).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Cadastrando...'
              : 'Candidatar-se'}
          </button>
        </>
      )}
    </form>
  );
}