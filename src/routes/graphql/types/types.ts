import { UUID } from 'crypto';

export type Subscriber = { userId: UUID, authorId: UUID }

export type Dto = { id: UUID, dto: unknown };
export type DtoOnly = { dto: unknown };

export type IdDto = { id: UUID };
