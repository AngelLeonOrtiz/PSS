import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar prefijo global '/api'
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());  
  // --- CONFIGURACIÓN DE SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('PSS Global Café API')
    .setDescription('Sistema de Gestión de Recepciones y Control de Café')
    .setVersion('1.0')
    .addBearerAuth() // 🔑 Permite usar tokens JWT en la interfaz
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // El segundo parámetro es la ruta: quedará en /api/docs
  SwaggerModule.setup('api/docs', app, document); 
  // --------------------------------

  // 2. Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();