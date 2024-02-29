import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo post
  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  // Obtener todos los posts
  async getAll(): Promise<any> {
    // Obtener todas las categorias distintas
    const posts = await this.prisma.post.findMany({
      orderBy: [
        {
          date: 'desc',
        },
      ],
    });

    // Obtener categorias distintas a raiz de posts
    const categories = posts.map((post) => post.category);
    const uniqueCategories = categories.filter((category, index) => {
      // La condición es cierta solo si la categoría actual aparece por primera vez en la lista
      return categories.indexOf(category) === index;
    });

    // Obtener todos los idiomas distintos
    const languages = posts.map((post) => post.language);
    const uniqueLanguages = languages.filter((language, index) => {
      // La condición es cierta solo si la categoría actual aparece por primera vez en la lista
      return languages.indexOf(language) === index;
    });

    // Obtener todos los tipos distintos
    const types = posts.map((post) => post.type);
    const uniqueTypes = types.filter((type, index) => {
      // La condición es cierta solo si la categoría actual aparece por primera vez en la lista
      return types.indexOf(type) === index;
    });

    const data = {
      categories: uniqueCategories,
      languages: uniqueLanguages,
      types: uniqueTypes,
      posts,
    };
    // Devolver todo junto
    return data;
  }

  // Obtener un post por id
  async getPostById(postId: string): Promise<Post> {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  }

  // Obtener posts por idioma
  async getPostsByLanguage(language: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        language,
      },
    });
  }

  // Actualizar un post
  async updatePost(
    postId: string,
    data: Prisma.PostUpdateInput,
  ): Promise<Post> {
    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data,
    });
  }

  // Eliminar un post
  async deletePost(postId: string): Promise<Post> {
    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
