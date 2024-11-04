import { CalendarAvailability, CalendarEvent, CalendarSlot, Weekday } from '../types';
import { isSlotAvailableWithEvents } from './is-slot-available-with-events';

/**
 * Descrição do conjunto de testes para a função isSlotAvailableWithEvents.
 */
describe(`02 - ${isSlotAvailableWithEvents.name}`, () => {
  
  // Define a disponibilidade do médico para cada dia da semana
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
          { hours: 12, minutes: 0 },
          { hours: 20, minutes: 0 },
        ],
      },
    ],
  };

  // Define uma lista de eventos agendados que o médico tem
  const events: CalendarEvent[] = [
    {
      start: new Date('2024-01-15T11:00:00Z'),
      end: new Date('2024-01-15T12:00:00Z'),
    }, // Evento na segunda-feira
    {
      start: new Date('2024-01-16T10:30:00Z'),
      end: new Date('2024-01-16T11:30:00Z'),
    }, // Evento na terça-feira
    {
      start: new Date('2024-01-17T13:00:00Z'),
      end: new Date('2024-01-17T14:00:00Z'),
    }, // Evento na quarta-feira
    {
      start: new Date('2024-01-18T15:30:00Z'),
      end: new Date('2024-01-18T16:50:00Z'),
    }, // Evento na quinta-feira
    {
      start: new Date('2024-01-19T18:00:00Z'),
      end: new Date('2024-01-19T19:55:00Z'),
    }, // Evento na sexta-feira
  ];

  // Teste para verificar se um slot disponível não conflita com eventos
  it('should return true for an available slot without conflicting events', () => {
    const availableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T17:15:00Z'), durationM: 45 }, // Slot disponível na segunda-feira às 17:15 UTC
      { start: new Date('2024-01-16T13:45:00Z'), durationM: 45 }, // Slot disponível na terça-feira às 13:45 UTC
      { start: new Date('2024-01-17T15:00:00Z'), durationM: 60 }, // Slot disponível na quarta-feira às 15:00 UTC
      { start: new Date('2024-01-18T15:00:00Z'), durationM: 20 }, // Slot disponível na quinta-feira às 15:00 UTC
      { start: new Date('2024-01-19T16:30:00Z'), durationM: 60 }, // Slot disponível na sexta-feira às 16:30 UTC
    ];

    // Verifica cada slot disponível e espera que a função retorne verdadeiro
    for (const slot of availableSlots) {
      const actual = isSlotAvailableWithEvents(availability, events, slot);
      const expected = true; // O esperado é que o slot esteja disponível
      expect(actual)
        .withContext(`Slot with ${slot.durationM} minutes at ${slot.start} should be available`)
        .toBe(expected);
    }
  });

  // Teste para verificar se um slot que sobrepõe um evento retorna falso
  it('should return false for a slot overlapping with an event', () => {
    const unavailableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T11:15:00Z'), durationM: 45 }, // Slot não disponível na segunda-feira às 11:15 UTC
      { start: new Date('2024-01-16T10:45:00Z'), durationM: 45 }, // Slot não disponível na terça-feira às 10:45 UTC
      { start: new Date('2024-01-17T13:00:00Z'), durationM: 60 }, // Slot não disponível na quarta-feira às 13:00 UTC
      { start: new Date('2024-01-18T15:30:00Z'), durationM: 20 }, // Slot não disponível na quinta-feira às 15:30 UTC
      { start: new Date('2024-01-19T18:30:00Z'), durationM: 60 }, // Slot não disponível na sexta-feira às 18:30 UTC
    ];

    // Verifica cada slot indisponível e espera que a função retorne falso
    for (const slot of unavailableSlots) {
      const actual = isSlotAvailableWithEvents(availability, events, slot);
      const expected = false; // O esperado é que o slot não esteja disponível
      expect(actual)
        .withContext(`Slot with ${slot.durationM} minutes at ${slot.start} should be unavailable`)
        .toBe(expected);
    }
  });
});
