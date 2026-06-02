export const ScheduleDuration = {
  THIRTY_MIN: "THIRTY_MIN",
  FORTY_FIVE_MIN: "FORTY_FIVE_MIN",
  ONE_HOUR: "ONE_HOUR",
  ONE_HALF_HOUR: "ONE_HALF_HOUR",
  TWO_HOURS: "TWO_HOURS",
  TWO_HALF_HOURS: "TWO_HALF_HOURS",
  THREE_HOURS: "THREE_HOURS",
};

export const ScheduleStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  FINISHED: "FINISHED",
  DELIVERED: "DELIVERED",
};

export const ScheduleDurationMetadata = {
  key: "duration",
  label: "Duração do Agendamento",
  values: ScheduleDuration,
  translations: {
    [ScheduleDuration.THIRTY_MIN]: "30 Minutos",
    [ScheduleDuration.FORTY_FIVE_MIN]: "45 Minutos",
    [ScheduleDuration.ONE_HOUR]: "1 Hora",
    [ScheduleDuration.ONE_HALF_HOUR]: "1 Hora e 30 Minutos",
    [ScheduleDuration.TWO_HOURS]: "2 Horas",
    [ScheduleDuration.TWO_HALF_HOURS]: "2 Horas e 30 Minutos",
    [ScheduleDuration.THREE_HOURS]: "3 Horas",
  }
};

export const ScheduleStatusMetadata = {
  key: "status",
  label: "Status do Agendamento",
  values: ScheduleStatus,
  translations: {
    [ScheduleStatus.SCHEDULED]: "Agendado",
    [ScheduleStatus.CONFIRMED]: "Confirmado",
    [ScheduleStatus.CANCELED]: "Cancelado",
    [ScheduleStatus.FINISHED]: "Finalizado",
    [ScheduleStatus.DELIVERED]: "Entregue",
  }
};

export const ScheduleEnums = [ScheduleDurationMetadata, ScheduleStatusMetadata];
