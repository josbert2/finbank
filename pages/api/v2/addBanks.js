import Prisma from '@prisma/client'

const { PrismaClient } = Prisma
const prisma = new PrismaClient()



    //id       String   @id @default(cuid()) @map("_id")
    //createdAt DateTime @default(now())
    //updatedAt DateTime @updatedAt
    //email     String   @unique
    //name      String?


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    if (!req.body) {
        return res.status(400).json({ message: 'No body provided' })
    }

    const { CardName } = req.body

    if (!CardName) {
        return res.status(400).json({ message: 'No CardName provided' })
    }

    try {
        const newCard = await prisma.account.create({
            data: {
                name: CardName,
                email: 'joheandroid',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        return res.status(200).json({ message: 'Card created', data: newCard })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Something went wrong' + error })
    }

}