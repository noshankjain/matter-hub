import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); 
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

// 1. Fetch all matters
app.get('/api/matters', async (req: Request, res: Response) => {
  const matters = await prisma.matter.findMany({
    include: { client: true }, 
  });
  res.json(matters);
});

// 2. Update a matter's status
app.put('/api/matters/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string; // <-- This is the fix!
  const { status } = req.body;
  
  const updatedMatter = await prisma.matter.update({
    where: { id },
    data: { status },
  });
  res.json(updatedMatter);
});

// 3. Temporary Seed Route
app.post('/api/seed', async (req: Request, res: Response) => {
  const newClient = await prisma.client.create({
    data: {
      name: 'TechCorp Inc.',
      email: 'legal@techcorp.com',
      matters: {
        create: [
          { title: 'TechCorp Merger', status: 'Discovery' },
          { title: 'Alpha Patent Dispute', status: 'Intake' },
          { title: 'Smith vs. City', status: 'Trial' }
        ],
      },
    },
  });
  res.json({ message: 'Dummy data successfully seeded into the database!', newClient });
});

app.listen(PORT, () => {
  console.log(`Database-connected server running on http://localhost:${PORT}`);
});