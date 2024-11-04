// Importação de tipos necessários
import { CalendarAvailability, CalendarEvent, CalendarSlot, Buffer } from '../types';

// Função que verifica se um slot está disponível considerando buffers
export const isSlotAvailableWithBuffer = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  slot: CalendarSlot,
): boolean => {
  // Obtém o dia da semana do slot
  const slotDay: number = slot.start.getUTCDay();
  const availabilityForDay = availability.include.find(a => a.weekday === slotDay as any);
  if (!availabilityForDay) {
    return false; // Médico não está disponível nesse dia
  }

  // Extrai o intervalo de horas de disponibilidade
  const [startRange, endRange] = availabilityForDay.range;
  const availabilityStartMinutes = startRange.hours * 60 + startRange.minutes;
  const availabilityEndMinutes = endRange.hours * 60 + endRange.minutes;

  // Calcula os horários de início e fim do slot em minutos
  const slotStartHours = slot.start.getUTCHours();
  const slotStartMinutes = slot.start.getUTCMinutes();
  const slotEndMinutes = slotStartHours * 60 + slotStartMinutes + slot.durationM;

  // Verifica se o slot está dentro do intervalo disponível
  if (slotStartHours * 60 + slotStartMinutes < availabilityStartMinutes || slotEndMinutes > availabilityEndMinutes) {
    return false; // Slot fora do horário disponível
  }

  // Verifica se o slot conflita com algum evento, considerando os buffers
  for (const event of events) {
    const eventStartTime = event.start.getTime();
    const eventEndTime = event.end.getTime();
    
    // Calcula os tempos de buffer
    const bufferBefore = event.buffer?.before || 0; // Padrão para 0 se não houver buffer
    const bufferAfter = event.buffer?.after || 0;   // Padrão para 0 se não houver buffer

    const bufferedStartTime = eventStartTime - bufferBefore * 60 * 1000; // Hora de início com buffer
    const bufferedEndTime = eventEndTime + bufferAfter * 60 * 1000;     // Hora de fim com buffer

    // Verifica conflitos com os horários de eventos com buffer
    if (
      (slot.start.getTime() >= bufferedStartTime && slot.start.getTime() < bufferedEndTime) || // Slot inicia durante um evento (com buffer)
      (slotEndMinutes * 60 * 1000 > bufferedStartTime && slotEndMinutes * 60 * 1000 <= bufferedEndTime) || // Slot termina durante um evento (com buffer)
      (slot.start.getTime() <= bufferedStartTime && slotEndMinutes * 60 * 1000 >= bufferedEndTime) // Slot sobrepõe completamente um evento (com buffer)
    ) {
      return false; // Conflito com um evento existente
    }
  }

  // Se não houver conflitos, o slot está disponível
  return true;
};

/* 

Explicações Detalhadas:
Importações:

O código começa importando os tipos necessários para a função: CalendarAvailability, CalendarEvent, CalendarSlot e Buffer.
Definição da Função:

A função isSlotAvailableWithBuffer é definida para verificar se um slot específico está disponível.
Obtendo o Dia da Semana:

A primeira etapa dentro da função é determinar o dia da semana (slotDay) do slot em questão.
Em seguida, é buscada a disponibilidade correspondente ao dia da semana.
Verificação de Disponibilidade:

Se não houver disponibilidade para o dia selecionado, a função retorna false.
Extração do Intervalo de Horas:

A função extrai o intervalo de horários de disponibilidade (início e fim) e converte esses horários em minutos.
Cálculo do Slot:

O horário de início e fim do slot é calculado em minutos.
Verificação de Conformidade:

A função verifica se o slot está dentro do intervalo de disponibilidade.
Se o slot estiver fora desse intervalo, a função retorna false.
Verificação de Conflitos com Eventos:

Para cada evento existente, a função calcula os tempos de início e fim considerando os buffers.
Em seguida, verifica se o slot se sobrepõe a algum evento (considerando os buffers).
Retorno:

Se não houver conflitos, a função retorna true, indicando que o slot está disponível.
Essa lógica garante que os horários sejam verificados de forma eficaz, considerando tanto a disponibilidade quanto os eventos agendados, além de permitir margens de tempo (buffers) que evitam sobreposições indesejadas.

*/