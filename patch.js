const fs = require('fs');
const content = fs.readFileSync('/home/khaled/Coding-Projects/BookingFlow/src/bookings/bookings.service.ts', 'utf8');

const newMethod = `
  async createPublic(createPublicBookingDto: CreatePublicBookingDto): Promise<Booking> {
    const { name, email, phone, ...bookingData } = createPublicBookingDto;

    // Find or create customer
    let customer = await this.prisma.user.findUnique({ where: { email } });
    
    if (!customer) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      customer = await this.prisma.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          role: 'CUSTOMER',
        }
      });
      this.eventEmitter.emit('user.registered', { email: customer.email });
    }

    return this.create(customer.id, bookingData);
  }
`;

const targetStr = `async create(customerId: string, createBookingDto: CreateBookingDto): Promise<Booking> {`;
const newContent = content.replace(targetStr, newMethod + '\n  ' + targetStr);

fs.writeFileSync('/home/khaled/Coding-Projects/BookingFlow/src/bookings/bookings.service.ts', newContent);
