import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';

/**
 * Função para verificar se um slot de tempo está disponível considerando a
 * disponibilidade do médico e eventos já agendados.
 * 
 * @param availability - Disponibilidade do médico por dia da semana.
 * @param events - Lista de eventos que indicam quando o médico está ocupado.
 * @param slot - O slot de tempo a ser verificado.
 * @returns - Retorna verdadeiro se o slot está disponível, falso caso contrário.
 */
export const isSlotAvailableWithEvents = (
  availability: CalendarAvailability,
  events: Array<Omit<CalendarEvent, 'buffer'>>, // Omit remove a propriedade 'buffer' de CalendarEvent
  slot: CalendarSlot,
): boolean => {
  
  // Obtém o dia da semana do slot (0 para domingo, 6 para sábado)
  const slotDay: number = slot.start.getUTCDay();
  const weekday = slotDay as any; // O 'as any' é um tipo de cast, mas pode ser removido se o tipo for bem definido

  // Encontra a disponibilidade para o dia específico
  const availabilityForDay = availability.include.find(a => a.weekday === weekday);
  if (!availabilityForDay) {
    return false; // O médico não está disponível neste dia
  }

  // Extrai o intervalo de horas da disponibilidade
  const [startRange, endRange] = availabilityForDay.range;
  const availabilityStartMinutes = startRange.hours * 60 + startRange.minutes; // Convertendo a hora de início para minutos
  const availabilityEndMinutes = endRange.hours * 60 + endRange.minutes; // Convertendo a hora de fim para minutos

  // Calcula o tempo de início e fim do slot em minutos
  const slotStartHours = slot.start.getUTCHours(); // Obtém a hora de início do slot
  const slotStartMinutes = slot.start.getUTCMinutes(); // Obtém os minutos de início do slot
  const slotEndMinutes = slotStartHours * 60 + slotStartMinutes + slot.durationM; // Calcula o tempo total de fim do slot

  // Verifica se o slot está dentro do intervalo de horas disponíveis
  if (slotStartHours * 60 + slotStartMinutes < availabilityStartMinutes || slotEndMinutes > availabilityEndMinutes) {
    return false; // O slot está fora do horário disponível
  }

  // Calcula o início e o fim do slot em milissegundos
  const slotStartTime = slot.start.getTime(); // Obtém o tempo de início do slot em milissegundos
  const slotEndTime = slotStartTime + slot.durationM * 60 * 1000; // Calcula o tempo de fim do slot em milissegundos

  // Verifica se o slot conflita com algum evento
  for (const event of events) {
    const eventStartTime = event.start.getTime(); // Obtém o tempo de início do evento em milissegundos
    const eventEndTime = event.end.getTime(); // Obtém o tempo de fim do evento em milissegundos

    // Verifica as condições de conflito
    if (
      (slotStartTime >= eventStartTime && slotStartTime < eventEndTime) || // O slot começa durante um evento
      (slotEndTime > eventStartTime && slotEndTime <= eventEndTime) ||     // O slot termina durante um evento
      (slotStartTime <= eventStartTime && slotEndTime >= eventEndTime)     // O slot sobrepõe completamente um evento
    ) {
      return false; // Conflito com um evento existente
    }
  }
  
  // Se não houver conflitos, o slot está disponível
  return true;
};


/* 

Explicações Detalhadas
Importações:

O código começa importando tipos que definem a estrutura dos dados que a função usará: CalendarAvailability, CalendarEvent, e CalendarSlot.
Comentários da Função:

A função isSlotAvailableWithEvents tem um comentário descritivo que explica seus parâmetros e o que ela retorna.
Obtenção do Dia da Semana:

A função usa getUTCDay() para determinar em que dia da semana o slot começa. Os dias são representados por números, onde 0 é domingo e 6 é sábado.
Verificação da Disponibilidade do Médico:

A função procura no objeto availability se o médico está disponível naquele dia específico. Se não houver disponibilidade, retorna false.
Cálculo dos Intervalos de Horário:

Extrai o intervalo de horário da disponibilidade e converte esses horários em minutos para facilitar as comparações.
Cálculo dos Horários do Slot:

A função calcula o horário de início e de fim do slot em minutos e em milissegundos. Isso é essencial para as próximas comparações.
Verificação se o Slot Está Dentro do Horário Disponível:

Um bloco condicional verifica se o slot está dentro do horário de disponibilidade. Se não estiver, retorna false.
Verificação de Conflitos com Eventos:

A função intera sobre cada evento e verifica se o slot solicitado conflita com algum evento já agendado, usando condições para determinar se o slot começa, termina ou se sobrepõe a um evento.
Retorno do Resultado:

Se não houver conflitos, a função retorna true, indicando que o slot está disponível.
Conclusão
Com essas explicações, você deve conseguir estudar e entender como cada parte do código funciona e como elas se inter-relacionam. Se precisar de mais detalhes ou tiver dúvidas sobre algum ponto específico, sinta-se à vontade para perguntar!

*/