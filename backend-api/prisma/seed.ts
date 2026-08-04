import { PrismaClient, Role, IncidentCategory, RiskLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin user — matches README credentials
  const adminPass = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@safeprotect.cm', password: adminPass, role: Role.ADMIN }
  });

  // Social Worker 1: Aline Ndey — matches README credentials
  const sw1Pass = await bcrypt.hash('Worker@123', 12);
  const sw1 = await prisma.user.create({
    data: {
      name: 'Aline Ndey',
      email: 'aline.ndey@safeprotect.cm',
      password: sw1Pass,
      role: Role.SOCIAL_WORKER,
      socialWorkerProfile: { create: { department: 'Child Protection', specialization: 'Sexual Abuse & Neglect' } }
    }
  });

  // Social Worker 2: Eric Tchana — matches README credentials
  const sw2Pass = await bcrypt.hash('Worker@123', 12);
  const sw2 = await prisma.user.create({
    data: {
      name: 'Eric Tchana',
      email: 'eric.tchana@safeprotect.cm',
      password: sw2Pass,
      role: Role.SOCIAL_WORKER,
      socialWorkerProfile: { create: { department: 'GBV Response', specialization: 'Domestic Violence' } }
    }
  });

  // Victim user: Marie Dupont — matches README credentials
  const victimPass = await bcrypt.hash('Victim@123', 12);
  const vUser = await prisma.user.create({
    data: {
      name: 'Marie Dupont',
      email: 'marie.dupont@email.cm',
      password: victimPass,
      role: Role.VICTIM,
      victimProfile: { create: { age: 25, gender: 'Female' } }
    }
  });

  const victimProfile = await prisma.victim.findUnique({ where: { userId: vUser.id } });

  // Seed incident and case
  const inc = await prisma.incident.create({
    data: {
      victimId: victimProfile!.id,
      category: IncidentCategory.DOMESTIC_VIOLENCE,
      description: 'Reported incident of domestic violence requiring immediate case assignment.',
      date: new Date('2024-05-31T10:30:00Z'),
      riskLevel: RiskLevel.HIGH,
      location: 'Yaoundé, Mfoundi',
    }
  });

  const sw1Profile = await prisma.socialWorker.findUnique({ where: { userId: sw1.id } });

  await prisma.case.create({
    data: {
      incidentId: inc.id,
      caseNumber: 'SPC-2026-00001',
      assignedWorkerId: sw1Profile!.id,
    }
  });

  console.log('✅ Seed completed successfully');
  console.log('Demo credentials:');
  console.log('  Admin:         admin@safeprotect.cm / Admin@123');
  console.log('  Social Worker: aline.ndey@safeprotect.cm / Worker@123');
  console.log('  Social Worker: eric.tchana@safeprotect.cm / Worker@123');
  console.log('  Victim:        marie.dupont@email.cm / Victim@123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
