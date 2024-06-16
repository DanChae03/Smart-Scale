export type Parent = {
  address?: string;
  babies?: Baby[];
  dateOfBirth?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  parentId?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
};

export type Nurse = {
  city?: string;
  firstName?: string;
  lastName?: string;
  nurseId?: string;
  schedule?: Appointment[];
};

export type Baby = {
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
};

export type BabyData = {
  checkupBookings?: Appointment[];
  currentWeight?: number;
  dateOfBirth?: string;
  ethnicity?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  parentRelationships?: { parentId?: string; relationship?: string }[];
};

export type Appointment = {
  checkupBookingId?: string;
  startTime?: string;
  endTime?: string;
};

export type AppointmentData = {
  babyId?: number;
  endTime?: string;
  location?: string;
  mainWeightReading?: WeightReading;
  nurseId?: number;
  parentId?: number;
  startTime?: string;
  weightReadings?: WeightReading[];
};

export type WeightReading = {
  id?: string;
  weight?: number;
  dateTimeTaken?: string;
};

export type User = {
  dateOfBirth?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  userId?: string;
};

export type CurrentUser = {
  dateOfBirth?: string;
  email?: string;
  firstName?: string;
  googleId?: string;
  hasCompletedUserRegistration?: boolean;
  id?: string;
  lastName?: string;
  phoneNumber?: string;
  preferredContact?: string;
  profileImageUrl?: string;
  roles?: string[];
};

export type Query = {
  author?: string;
  dateCreated?: string;
  id?: number;
  resolved?: boolean;
  messages?: Message[];
};

export type Message = {
  author?: string;
  content?: string;
  dateCreated?: string;
};

export type WeightStatistic = {
  months?: number;
  weights?: number[];
};

export type CityStatistics = {
  cityName?: string;
  weights?: WeightStatistic[];
};

export type AverageData = {
  weights?: number[];
  months?: number[];
};
