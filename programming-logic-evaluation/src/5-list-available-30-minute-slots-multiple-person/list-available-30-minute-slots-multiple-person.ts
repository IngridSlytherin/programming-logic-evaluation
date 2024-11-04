import { CalendarAvailability, CalendarEvent, CalendarSlot, Weekday } from '../types';

export const listAvailable30MinuteSlotsMultiplePerson = (
  attendees: Array<{
    availability: CalendarAvailability;
    events: Array<CalendarEvent>;
  }>,
  range: [Date, Date],
): Array<CalendarSlot> => {
  const availableSlots: CalendarSlot[] = [];

  // Iterate through each day in the range
  for (let date = new Date(range[0]); date <= range[1]; date.setUTCDate(date.getUTCDate() + 1)) {
    const dayOfWeek = date.getUTCDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ...)

    // Array to hold potential slots for the day
    const dailyAvailableSlots: CalendarSlot[] = [];

    // Check each attendee for availability
    attendees.forEach(attendee => {
      const availabilityForDay = attendee.availability.include.find(a => a.weekday === dayOfWeek);
      if (!availabilityForDay) return; // No availability for this attendee on this day

      // Extract time range for the availability
      const [startRange, endRange] = availabilityForDay.range;
      const availabilityStartTime = new Date(date);
      availabilityStartTime.setUTCHours(startRange.hours, startRange.minutes, 0, 0);
      const availabilityEndTime = new Date(date);
      availabilityEndTime.setUTCHours(endRange.hours, endRange.minutes, 0, 0);

      // Generate 30-minute slots within the availability range
      for (let slotStart = availabilityStartTime; slotStart < availabilityEndTime; slotStart.setUTCMinutes(slotStart.getUTCMinutes() + 30)) {
        const slotEnd = new Date(slotStart);
        slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + 30);

        // Check if the slot conflicts with any events for this attendee
        const conflicts = attendee.events.some(event => {
          const eventStartTime = event.start.getTime();
          const eventEndTime = event.end.getTime();

          // Calculate buffer times
          const bufferBefore = event.buffer?.before || 0;
          const bufferAfter = event.buffer?.after || 0;
          const bufferedStartTime = eventStartTime - bufferBefore * 60 * 1000;
          const bufferedEndTime = eventEndTime + bufferAfter * 60 * 1000;

          return (
            (slotStart.getTime() >= bufferedStartTime && slotStart.getTime() < bufferedEndTime) || // Slot starts during an event (with buffer)
            (slotEnd.getTime() > bufferedStartTime && slotEnd.getTime() <= bufferedEndTime) ||     // Slot ends during an event (with buffer)
            (slotStart.getTime() <= bufferedStartTime && slotEnd.getTime() >= bufferedEndTime)     // Slot completely overlaps an event (with buffer)
          );
        });

        // If there are no conflicts, add the slot to dailyAvailableSlots
        if (!conflicts) {
          // Add the slot only if it's not already included
          if (!dailyAvailableSlots.some(existingSlot => existingSlot.start.getTime() === slotStart.getTime())) {
            dailyAvailableSlots.push({ start: new Date(slotStart), durationM: 30 });
          }
        }
      }
    });

    // Filter to keep only slots that are available for all attendees
    dailyAvailableSlots.forEach(slot => {
      const isAvailableForAll = attendees.every(attendee => {
        const availabilityForDay = attendee.availability.include.find(a => a.weekday === dayOfWeek);
        if (!availabilityForDay) return false; // No availability for this attendee on this day

        const [startRange, endRange] = availabilityForDay.range;
        const availabilityStartTime = new Date(date);
        availabilityStartTime.setUTCHours(startRange.hours, startRange.minutes, 0, 0);
        const availabilityEndTime = new Date(date);
        availabilityEndTime.setUTCHours(endRange.hours, endRange.minutes, 0, 0);

        // Check if the slot is within the availability range
        const isWithinAvailability = (
          slot.start.getTime() >= availabilityStartTime.getTime() &&
          slot.start.getTime() + slot.durationM * 60 * 1000 <= availabilityEndTime.getTime()
        );

        // Check for conflicts with events, including buffers
        const hasConflicts = attendee.events.some(event => {
          const eventStartTime = event.start.getTime();
          const eventEndTime = event.end.getTime();
          const bufferBefore = event.buffer?.before || 0;
          const bufferAfter = event.buffer?.after || 0;
          const bufferedStartTime = eventStartTime - bufferBefore * 60 * 1000;
          const bufferedEndTime = eventEndTime + bufferAfter * 60 * 1000;

          return (
            (slot.start.getTime() >= bufferedStartTime && slot.start.getTime() < bufferedEndTime) ||
            (slot.start.getTime() + slot.durationM * 60 * 1000 > bufferedStartTime && slot.start.getTime() + slot.durationM * 60 * 1000 <= bufferedEndTime) ||
            (slot.start.getTime() <= bufferedStartTime && slot.start.getTime() + slot.durationM * 60 * 1000 >= bufferedEndTime)
          );
        });

        return isWithinAvailability && !hasConflicts;
      });

      // If the slot is available for all attendees, add it to availableSlots
      if (isAvailableForAll) {
        availableSlots.push(slot);
      }
    });
  }

  return availableSlots;
};

/* 
Explicação dos Testes
Teste de Disponibilidade Sem Conflitos:

Verifica se a função retorna corretamente os slots disponíveis para múltiplos participantes sem conflitos de eventos.
Teste de Conflitos de Eventos:

Garante que a função retorne um array vazio quando todos os participantes têm eventos que conflitam.
Teste de Buffer de Eventos:

Confirma se a função considera os buffers antes e depois dos eventos ao calcular os slots disponíveis.
Teste de Disponibilidade e Eventos Vazios:

Valida o comportamento da função quando não há participantes com disponibilidade ou eventos.
Conclusão
Esses testes ajudam a garantir que a função listAvailable30MinuteSlotsMultiplePerson funcione corretamente em várias situações, lidando com a lógica de disponibilidade e conflitos de eventos. Você pode rodar esses testes usando o comando jest no terminal, assumindo que você já tenha o Jest configurado no seu projeto.
*/