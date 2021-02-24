import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';

import { Post as PostEntity } from './post';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  create(@Body() post: PostEntity) {
    return this.postService.createPost(post);
  }

  @Get()
  findAll() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.getPostById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() post: PostEntity) {
    return this.postService.updatePost(+id, post);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.deletePost(+id);
  }
}
