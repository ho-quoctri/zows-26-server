import { Space, SpaceSchema } from "@/modules/spaces/schema/space.schema";
import { SpacesController } from "@/modules/spaces/spaces.controller";
import { SpacesService } from "@/modules/spaces/spaces.service";
import { UsersModule } from "@/modules/users/users.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
