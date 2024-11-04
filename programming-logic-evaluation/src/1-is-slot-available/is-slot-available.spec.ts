import { CalendarAvailability, CalendarSlot, Weekday } from '../types';
import { isSlotAvailable } from './is-slot-available';

// Grupo de testes para a função isSlotAvailable
describe(`01 - ${isSlotAvailable.name}`, () => {
  // Definindo a disponibilidade do calendário
  const availability: CalendarAvailability = {
    include: [
      {
        weekday: Weekday.monday,
        range: [ //range é uma propriedade que contém um array com dois objetos, cada um representando um horário específico.
          { hours: 9, minutes: 0 }, //horario de inicio da disponibilidade 
          { hours: 12, minutes: 0 }, // horario de termino da disponibilidade
        ],
      },
      {
        weekday: Weekday.tuesday,
        range: [
          { hours: 14, minutes: 0 },
          { hours: 18, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.wednesday,
        range: [
          { hours: 10, minutes: 0 },
          { hours: 16, minutes: 0 },
        ],
      },
      {
        weekday: Weekday.thursday,
        range: [
          { hours: 8, minutes: 30 },
          { hours: 11, minutes: 30 },
        ],
      },
      {
        weekday: Weekday.friday,
        range: [
          { hours: 13, minutes: 0 },
          { hours: 17, minutes: 0 },
        ],
      },
    ],
  };

  // Teste para verificar se a função retorna true para horários disponíveis
  it('deve retornar true para um horário disponível', () => {
    const availableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T09:15:00Z'), durationM: 45 }, // Segunda-feira às 9:15 UTC
      { start: new Date('2024-01-16T16:45:00Z'), durationM: 45 }, // Terça-feira às 16:45 UTC
      { start: new Date('2024-01-17T14:00:00Z'), durationM: 60 }, // Quarta-feira às 14:00 UTC
      { start: new Date('2024-01-18T08:30:00Z'), durationM: 30 }, // Quinta-feira às 8:30 UTC
      { start: new Date('2024-01-19T15:30:00Z'), durationM: 60 }, // Sexta-feira às 15:30 UTC
    ];

    // Verifica se todos os horários disponíveis estão realmente disponíveis
    const result = availableSlots.every(slot => isSlotAvailable(availability, slot));

    expect(result).toBe(true); // Espera que todos os slots estejam disponíveis
  });

  // Teste para verificar se a função retorna false para horários indisponíveis
  it('deve retornar false para um horário indisponível', () => {
    const unavailableSlots: CalendarSlot[] = [
      { start: new Date('2024-01-15T17:15:00Z'), durationM: 45 }, // Segunda-feira às 17:15 UTC
      { start: new Date('2024-01-16T13:45:00Z'), durationM: 45 }, // Terça-feira às 13:45 UTC
      { start: new Date('2024-01-17T08:00:00Z'), durationM: 60 }, // Quarta-feira às 08:00 UTC
      { start: new Date('2024-01-18T08:30:00Z'), durationM: 240 }, // Quinta-feira às 08:30 UTC
      { start: new Date('2024-01-19T12:30:00Z'), durationM: 60 }, // Sexta-feira às 12:30 UTC
    ];

    // Verifica se todos os horários indisponíveis retornam false
    const result = unavailableSlots.every(slot => isSlotAvailable(availability, slot) === false);

    expect(result).toBe(true); // Espera que todos os slots não estejam disponíveis
  });
});
