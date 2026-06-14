import React from 'react';

export default function Tabela({
  colunas,
  dados,
  mensagemVazia = 'Nenhum registro encontrado.'
}) {
  if (dados.length === 0) {
    return <p>{mensagemVazia}</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna.chave}
                style={estiloCelula}
              >
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dados.map((item, indice) => (
            <tr key={item.id ?? indice}>
              {colunas.map((coluna) => (
                <td
                  key={coluna.chave}
                  style={estiloCelula}
                >
                  {coluna.renderizar
                    ? coluna.renderizar(item)
                    : item[coluna.chave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estiloCelula = {
  border: '1px solid #cccccc',
  padding: '10px',
  textAlign: 'left'
};