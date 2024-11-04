import { CalendarAvailability, CalendarSlot, Weekday } from '../types';

// Função que verifica se um slot de calendário está disponível
export const isSlotAvailable = (availability: CalendarAvailability, slot: CalendarSlot): boolean => {
  // Obtém o dia da semana do slot (0 = Domingo, 1 = Segunda, etc.)
  const slotDay: number = slot.start.getUTCDay();
  const weekday: Weekday = slotDay as Weekday;

  // Encontra a disponibilidade para o dia específico
  const availabilityForDay = availability.include.find(a => a.weekday === weekday);
  if (!availabilityForDay) {
    return false; // Se não houver disponibilidade nesse dia, retorna false
  }

  // Extrai horas e minutos do slot
  const slotStartHours = slot.start.getUTCHours();
  const slotStartMinutes = slot.start.getUTCMinutes();
  const slotEndMinutes = slotStartHours * 60 + slotStartMinutes + slot.durationM; // Calcula o tempo de fim do slot

  // Extrai o início e o fim do intervalo de disponibilidade
  const [startRange, endRange] = availabilityForDay.range;

  // Converte o intervalo de disponibilidade para minutos
  const availabilityStartMinutes = startRange.hours * 60 + startRange.minutes;
  const availabilityEndMinutes = endRange.hours * 60 + endRange.minutes;

  // Verifica se o slot está dentro do intervalo de disponibilidade
  return slotStartHours * 60 + slotStartMinutes >= availabilityStartMinutes 
      && slotEndMinutes <= availabilityEndMinutes; // Retorna true se o slot estiver disponível
};

/* 

Explicações Detalhadas
Importações:

O código importa tipos que definem a estrutura de dados, como CalendarAvailability, CalendarEvent, CalendarSlot e Weekday, além da função a ser testada isSlotAvailableWithEvents.
Descrição do Conjunto de Testes:

describe é usado para agrupar os testes da função isSlotAvailableWithEvents, ajudando a organizar os casos de teste.
Disponibilidade do Médico:

Define a disponibilidade do médico em dias da semana, com horários específicos em que ele pode atender. A disponibilidade é um objeto que inclui um array de dias da semana (Weekday) e os horários correspondentes.
Eventos Agendados:

Um array de eventos é definido, representando compromissos que o médico já tem agendados. Cada evento tem um horário de início e fim.
Teste de Slot Disponível:

O primeiro teste (it) verifica se a função retorna true para slots que estão disponíveis e não se sobrepõem a eventos. Um array de slots disponíveis é criado, e a função é chamada para cada um deles, comparando o resultado com o valor esperado (true).
Contexto dos Testes:

A função withContext é utilizada para fornecer uma mensagem descritiva que ajuda a identificar qual slot está sendo testado, facilitando a depuração em caso de falha.
Teste de Slot Indisponível:

O segundo teste verifica se a função retorna false para slots que se sobrepõem a eventos já agendados. Um array de slots não disponíveis é criado, e a função é chamada para cada um, esperando que o resultado seja false.
Conclusão
Essas explicações devem ajudar você a compreender o funcionamento do arquivo de testes e como ele interage com a função isSlotAvailableWithEvents. Se precisar de mais informações ou tiver dúvidas sobre qualquer parte do código, sinta-se à vontade para perguntar!

*/