import { CalendarAvailability, CalendarEvent, CalendarSlot, Weekday } from '../types';
import { isSlotAvailableWithBuffer } from './is-slot-available-with-buffer';

// Grupo de testes para a função isSlotAvailableWithBuffer
describe(`03 - ${isSlotAvailableWithBuffer.name}`, () => {
  // Definindo a disponibilidade do calendário
  const availability: CalendarAvailability = {
    include: [
      {
        weekday: Weekday.monday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.tuesday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.wednesday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.thursday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.friday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.saturday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.sunday,
        range: [
          { hours: 8, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
    ],
  };

  // Definindo os eventos do calendário, incluindo buffers
  const events: CalendarEvent[] = [
    {
      start: new Date('2024-01-15T08:30:00Z'),
      end: new Date('2024-01-15T09:30:00Z'),
      buffer: { before: 15, after: 15 },
    }, // Evento na segunda-feira com buffer
    {
      start: new Date('2024-01-16T10:30:00Z'),
      end: new Date('2024-01-16T11:30:00Z'),
      buffer: { before: 35, after: 25 },
    }, // Evento na terça-feira com buffer
    {
      start: new Date('2024-01-17T17:00:00Z'),
      end: new Date('2024-01-17T17:30:00Z'),
      buffer: { before: 0, after: 0 },
    }, // Evento na quarta-feira sem buffer
    {
      start: new Date('2024-01-18T15:00:00Z'),
      end: new Date('2024-01-18T16:00:00Z'),
      buffer: { before: 10, after: 10 },
    }, // Evento na quinta-feira com buffer
    {
      start: new Date('2024-01-19T09:45:00Z'),
      end: new Date('2024-01-19T10:15:00Z'),
      buffer: { before: 5, after: 5 },
    }, // Evento na sexta-feira com buffer
  ];

  // Teste para verificar se a função retorna true para um horário disponível
  it('should return true for an available slot without conflicting events and buffers', () => {
    const availableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T12:50:00Z'), durationM: 45 }, // Segunda-feira às 12:50 UTC
      { start: new Date('2024-01-16T13:45:00Z'), durationM: 45 }, // Terça-feira às 13:45 UTC
      { start: new Date('2024-01-17T15:00:00Z'), durationM: 60 }, // Quarta-feira às 15:00 UTC
      { start: new Date('2024-01-18T16:20:00Z'), durationM: 20 }, // Quinta-feira às 16:20 UTC
      { start: new Date('2024-01-19T16:30:00Z'), durationM: 60 }, // Sexta-feira às 16:30 UTC
    ];

    // Verifica se todos os horários disponíveis estão realmente disponíveis
    const result = availableSlots.every(slot => isSlotAvailableWithBuffer(availability, events, slot));

    expect(result).toBe(true); // Espera que todos os slots estejam disponíveis
  });

  // Teste para verificar se a função retorna false para horários que se sobrepõem a eventos e buffers
  it('should return false for a slot overlapping with an event and buffer', () => {
    const unavailableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T09:40:00Z'), durationM: 45 }, // Segunda-feira às 9:40 UTC
      { start: new Date('2024-01-16T11:50:00Z'), durationM: 45 }, // Terça-feira às 11:50 UTC
      { start: new Date('2024-01-17T17:10:00Z'), durationM: 60 }, // Quarta-feira às 17:10 UTC
      { start: new Date('2024-01-18T14:55:00Z'), durationM: 20 }, // Quinta-feira às 14:55 UTC
      { start: new Date('2024-01-19T09:43:00Z'), durationM: 60 }, // Sexta-feira às 09:43 UTC
    ];

    // Verifica se todos os horários indisponíveis retornam false
    const result = unavailableSlots.every(slot => isSlotAvailableWithBuffer(availability, events, slot) === false);

    expect(result).toBe(true); // Espera que todos os slots não estejam disponíveis
  });
});

/* 

Explicações Detalhadas
Importações:

O arquivo começa com a importação de tipos e a função isSlotAvailableWithBuffer, que é a função a ser testada.
Grupo de Testes:

describe é utilizado para agrupar os testes relacionados à função isSlotAvailableWithBuffer. O nome do grupo inclui o nome da função para melhor organização.
Disponibilidade do Calendário:

É definido um objeto availability que contém a disponibilidade para cada dia da semana, especificando o horário em que as slots estão disponíveis.
Eventos do Calendário:

A lista events define eventos que já estão agendados, cada um com um intervalo de tempo (buffer) antes e depois. Isso é importante para garantir que novos agendamentos não se sobreponham a eventos já existentes.
Teste para Horários Disponíveis:

O primeiro teste (it) verifica se a função isSlotAvailableWithBuffer retorna true para uma lista de horários que devem estar disponíveis, dado que não há conflitos com eventos existentes e os buffers.
Teste para Horários Indisponíveis:

O segundo teste verifica se a função retorna false para horários que se sobrepõem a eventos existentes, considerando os buffers especificados. Isso garante que novos horários não sejam agendados quando estão em conflito com eventos já agendados.

*/