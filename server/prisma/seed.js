import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.taskAttachment.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@taskmanager.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create member users
  const member1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@taskmanager.com',
      password: await bcrypt.hash('john123', 10),
      role: 'member',
    },
  });

  const member2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@taskmanager.com',
      password: await bcrypt.hash('jane123', 10),
      role: 'member',
    },
  });

  const member3 = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob@taskmanager.com',
      password: await bcrypt.hash('bob123', 10),
      role: 'member',
    },
  });
  console.log('✅ Created 3 member users');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdById: adminUser.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Develop iOS and Android mobile application',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      createdById: adminUser.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Database Optimization',
      description: 'Optimize database queries and improve performance',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      createdById: adminUser.id,
    },
  });
  console.log('✅ Created 3 projects');

  // Add project members
  await prisma.projectMember.create({
    data: { projectId: project1.id, userId: member1.id },
  });
  await prisma.projectMember.create({
    data: { projectId: project1.id, userId: member2.id },
  });
  await prisma.projectMember.create({
    data: { projectId: project2.id, userId: member2.id },
  });
  await prisma.projectMember.create({
    data: { projectId: project2.id, userId: member3.id },
  });
  await prisma.projectMember.create({
    data: { projectId: project3.id, userId: member1.id },
  });
  console.log('✅ Added project members');

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design UI mockups',
      description: 'Create wireframes and mockups for new design',
      priority: 'high',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: project1.id,
      assignedToId: member1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Frontend development',
      description: 'Implement React components for new design',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      projectId: project1.id,
      assignedToId: member2.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Backend API integration',
      description: 'Integrate with backend APIs',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      projectId: project1.id,
      assignedToId: null, // Unassigned
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'App architecture design',
      description: 'Design app architecture and structure',
      priority: 'high',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      projectId: project2.id,
      assignedToId: member2.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Authentication implementation',
      description: 'Implement user authentication system',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      projectId: project2.id,
      assignedToId: member3.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: 'Query optimization',
      description: 'Optimize slow database queries',
      priority: 'medium',
      status: 'completed',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      projectId: project3.id,
      assignedToId: member1.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: 'Indexing strategy',
      description: 'Add proper database indexes',
      priority: 'medium',
      status: 'in_progress',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      projectId: project3.id,
      assignedToId: member1.id,
    },
  });
  console.log('✅ Created 7 tasks');

  // Create task comments
  await prisma.taskComment.create({
    data: {
      content: 'Great work on the mockups! They look amazing.',
      taskId: task1.id,
      userId: adminUser.id,
    },
  });

  await prisma.taskComment.create({
    data: {
      content: 'I started working on this. Will have the first version ready by tomorrow.',
      taskId: task1.id,
      userId: member1.id,
    },
  });
  console.log('✅ Created task comments');

  console.log('🌱 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
