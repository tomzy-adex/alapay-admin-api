import { Global, Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './entities/claim.entity';
import { ClaimRepository } from './repositories/claim.repository';
import { Note } from './entities/note.entity';
import { ProviderClaim } from './entities/provider-claim.entity';
import { NoteRepository } from './repositories/note.repository';
import { ProviderClaimRepository } from './repositories/provider-claim.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Claim, Note, ProviderClaim])],
  providers: [
    ClaimService,
    ClaimRepository,
    NoteRepository,
    ProviderClaimRepository,
  ],
  controllers: [ClaimController],
  exports: [
    ClaimService,
    ClaimRepository,
    NoteRepository,
    ProviderClaimRepository,
  ],
})
export class ClaimModule {}
