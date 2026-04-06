import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); 
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

// 1. Get all matters
app.get('/api/matters', async (req: Request, res: Response) => {
  const matters = await prisma.matter.findMany({
    include: { client: true, documents: true }
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

// 4. Delete a matter
app.delete('/api/matters/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.matter.delete({
      where: { id },
    });
    res.json({ message: "Matter successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete matter" });
  }
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

app.post('/api/matters', async (req: Request, res: Response) => {
  const { title } = req.body;
  
  const defaultClient = await prisma.client.findFirst();
  if (!defaultClient) {
    res.status(400).json({ error: "No client found in database" });
    return;
  }

  const newMatter = await prisma.matter.create({
    data: {
      title,
      clientId: defaultClient.id,
      status: 'Intake'
    },
    include: { client: true }
  });
  
  res.json(newMatter);
});
// Create a new document
app.post('/api/documents', async (req: Request, res: Response) => {
  const { name, size, matterId } = req.body;
  try {
    const newDoc = await prisma.document.create({
      data: { name, size, matterId }
    });
    res.json(newDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// Delete a document record
app.delete('/api/documents/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string; // This tells TypeScript it's definitely a single string
  
  try {
    await prisma.document.delete({
      where: { id }
    });
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

app.get('/api/clients', async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: { matters: true } // Include their cases
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

app.post('/api/clients', async (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  try {
    const newClient = await prisma.client.create({
      data: { name, email, phone }
    });
    res.json(newClient);
  } catch (error) {
    res.status(500).json({ error: "Failed to create client" });
  }
});

app.listen(PORT, () => {
  console.log(`Database-connected server running on http://localhost:${PORT}`);
});