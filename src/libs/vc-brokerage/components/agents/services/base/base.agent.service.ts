import { Injectable } from '@nestjs/common';
import { AgentsRoles } from "@/libs/vc-brokerage/components/agents/types";

@Injectable()
export class BaseAgentService {
   constructor(
     public readonly did: string,
     public readonly role: AgentsRoles
   ) {}
}