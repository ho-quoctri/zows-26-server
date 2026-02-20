import { CreateSpaceDto } from '@/modules/spaces/dto/create-space.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {}
