function pad(n){return String(n).padStart(2,'0');}
function randDate(startYear, spanYears){
  const y = startYear + Math.floor(Math.random()*(spanYears||2));
  const m = 1+Math.floor(Math.random()*12);
  const d = 1+Math.floor(Math.random()*27);
  return `${y}-${pad(m)}-${pad(d)}`;
}
const SETORES = ['CENTRO CIRURGICO','ENDOSCOPIA','CME','NAC','BANCO DE LEITE','UTI 5','UTI 3','LABORATORIO'];
const FUNCOES = ['TECNICA DE ENFERMAGEM','ENFERMEIRA','AUXILIAR DE SERVICOS GERAIS','AUXILIAR DE LABORATORIO','MEDICO'];
const TURNOS = ['MANHA','TARDE','NOITE'];
const AGENTES = ['AGULHA','PERFUROCORTANTE','SECRECAO SANGUINOLENTA','PISO IRREGULAR','MOTOCICLETA','BISTURI'];
const TIPOS = ['TIPICO (BIOLOGICO)','TRAJETO','TIPICO'];
const VINCULOS = ['CLT','COOPERADO','TERCEIRIZADO','RESIDENTE/INTERNO','SERVIDOR SESA'];
const EMPRESAS = ['COOPAH','SERVAL','COOPTACE','SERVINAC','SERVNAC','ISM'];
const PARTES = ['MUCOSA OCULAR','DEDO INDICADOR ESQUERDO','MAO DIREITA','TORNOZELO DIREITO'];
const CIDS = ['Y28.9','Z20.9','W01','S93.4','V29'];
const STATUS = ['CONFORME','PENDENTE','EM DIA','VENCIDO'];
const VAC_STATUS = ['CONFORME','NAO CONFORME'];

function makeAcidentes(n){
  const out=[];
  for(let i=0;i<n;i++){
    out.push({
      nome:'Func '+i, setor: SETORES[i%SETORES.length], funcao: FUNCOES[i%FUNCOES.length],
      data_acidente: randDate(2024,3), turno: TURNOS[i%TURNOS.length],
      tipo_acidente: TIPOS[i%TIPOS.length], agente_causador: AGENTES[i%AGENTES.length],
      parte_corpo: PARTES[i%PARTES.length], vinculo: VINCULOS[i%VINCULOS.length],
      empresa: EMPRESAS[i%EMPRESAS.length], cid: CIDS[i%CIDS.length],
      afastamento: i%5===0?'SIM':'NAO', numero_cat: i%4===0?null:'CAT'+i,
      houve_lesao: 'SIM', _tipo:'acidente', _ano:'2026'
    });
  }
  return out;
}
function makeAtendimento(n){
  const out=[];
  for(let i=0;i<n;i++){
    out.push({ data: randDate(2024,3), nome:'Func '+i, setor: SETORES[i%SETORES.length], funcao: FUNCOES[i%FUNCOES.length],
      cpf:'000', aso:'SIM', pendencias: i%3===0?'SIM':'NAO', status: STATUS[i%STATUS.length], medico:'DR '+(i%3) });
  }
  return out;
}
function makeAbsenteismo(n){
  const out=[];
  for(let i=0;i<n;i++){
    out.push({ nome:'Func '+i, matricula:''+i, setor: SETORES[i%SETORES.length], funcao: FUNCOES[i%FUNCOES.length],
      data_emissao: randDate(2024,3), cid: CIDS[i%CIDS.length], periodo_dias: String(1+(i%10)), comparecimento: i%4===0?'NAO':'SIM' });
  }
  return out;
}
function makeExtintor(n){
  // Simula a estrutura real: uma aba por mês de vistoria, o MESMO conjunto
  // de extintores aparecendo em cada aba (repetido mês a mês).
  const out=[];
  const TIPOS = ['ABC 6KG','ABC 8KG','CO2 6KG','AP 10L','BC 8KG'];
  const ABAS = ['JULHO/2025','AGOSTO/2025','SETEMBRO/2025','OUTUBRO/2025','NOVEMBRO/2025','DEZEMBRO/2025','JANEIRO/2026','FEVEREIRO 2026','MAIO 2026','JUNHO 2026'];
  ABAS.forEach((aba, abaIdx) => {
    for(let i=0;i<n;i++){
      out.push({ numero_extintor: 'EXT'+i, pavimento: 'Pav '+(i%5), tipo: TIPOS[i%TIPOS.length],
        local:'Corredor', sinalizacao:'OK', lacre:'OK', manometro:'OK',
        condicao_carga: 'PRESSURIZADO', placa: i%6===0?'NC':'C',
        proxima_recarga: randDate(2025 + (abaIdx % 2), 2), proximo_teste_hidro: randDate(2026, 2),
        _aba: aba });
    }
  });
  return out;
}
function makeSaudeAsos(n){
  // Situacao real (sem ano na aba): cada funcionario acumula 1 a 3 exames
  // historicos na MESMA aba ao longo do tempo. Exames antigos aparecem
  // "vencidos" (normal, ja foram renovados) - so o mais recente de cada
  // funcionario deve contar como situacao atual.
  const out=[];
  for(let i=0;i<n;i++){
    const numExames = 1 + (i % 3);
    for(let e=0;e<numExames;e++){
      const isLatest = e === numExames - 1;
      const status = isLatest ? (i % 5 === 0 ? 'PENDENTE' : 'CONFORME') : 'VENCIDO';
      out.push({ nome:'Func '+i, matricula: 'MAT'+i, setor: SETORES[i%SETORES.length], funcao: FUNCOES[i%FUNCOES.length],
        sexo: i%2===0?'FEMININO':'MASCULINO', idade: 20+i%40, status,
        data_aso: randDate(2024 + e, 1),
        influenza_status: isLatest ? (i % 4 === 0 ? 'NAO CONFORME' : 'CONFORME') : VAC_STATUS[i%2],
        covid_status: isLatest ? (i % 6 === 0 ? 'NAO CONFORME' : 'CONFORME') : VAC_STATUS[(i+1)%2],
        status_dt: VAC_STATUS[i%2], status_dtpa: VAC_STATUS[(i+1)%2],
        status_hepatite_b: VAC_STATUS[i%2], meningo_status: VAC_STATUS[(i+1)%2],
        status_triplice_viral: VAC_STATUS[i%2], varicela_status: VAC_STATUS[(i+1)%2],
        _aba: 'CONTROLE DE ASOS' });
    }
  }
  return out;
}
function makeSaude(n){
  const out=[];
  for(let i=0;i<n;i++){
    out.push({ nome:'Func '+i, setor: SETORES[i%SETORES.length], funcao: FUNCOES[i%FUNCOES.length],
      sexo: i%2===0?'FEMININO':'MASCULINO', idade: 20+i%40, status: STATUS[i%STATUS.length] });
  }
  return out;
}
function makeDocumentos(n){
  const out=[];
  for(let i=0;i<n;i++){
    out.push({ tipo_documento: i%2===0?'PROCEDIMENTO':'LAUDO', titulo:'Doc '+i,
      data_validade: randDate(2026), status: STATUS[i%STATUS.length], vencimento: randDate(2026),
      situacao: STATUS[i%STATUS.length], responsavel:'Resp '+(i%4) });
  }
  return out;
}

// Simula um documento recorrente (ex: CIPA anual) com um ciclo antigo já
// vencido (normal, foi renovado) e o ciclo atual, ainda válido.
function makeCipaComHistorico(){
  return [
    { tipo_documento: 'CIPA', titulo: 'NR 05 CIPA (ANUAL)', data_validade: '2026-03-11', status: 'VENCIDO', vencimento: '2026-03-11', situacao: 'VENCIDO', responsavel: 'Resp CIPA' },
    { tipo_documento: 'CIPA', titulo: 'NR 05 CIPA (ANUAL)', data_validade: '2027-03-13', status: 'CONFORME', vencimento: '2027-03-13', situacao: 'CONFORME', responsavel: 'Resp CIPA' },
  ];
}

window.__MOCK_DATA__ = {
  generated_at: new Date().toISOString(),
  atendimento: { all: makeAtendimento(40) },
  absenteismo: { all: makeAbsenteismo(35) },
  acidentes: { all: makeAcidentes(102) },
  extintor: { all: makeExtintor(60) },
  saude: {
    asos: makeSaudeAsos(30), desligados: makeSaude(10), atendimentos: makeSaude(15),
    atendimentos_psicologicos: makeSaude(8), unidades: { SERVAL: makeSaude(5) }
  },
  documentos: { documentos: makeDocumentos(12), laudos: makeDocumentos(6), fluxpopinter: makeDocumentos(4), treinamentos: makeDocumentos(9), cipa: makeDocumentos(3).concat(makeCipaComHistorico()) },
  _errors: []
};
