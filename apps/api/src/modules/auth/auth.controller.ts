import { Controller, Post, Body, Req, HttpCode, HttpStatus, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';

import { Public } from '../../common/decorators/public.decorator';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto/auth.dto';


@Controller('api/v1/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto, 
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(loginDto, ip, userAgent);

    // Set HttpOnly Cookies for Next.js to parse
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'lax' });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });
    res.cookie('sessionId', result.sessionId, { httpOnly: true, secure: true, sameSite: 'lax' });

    return { success: true };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    // In a real scenario, extract sessionId and refreshToken from cookies
    // Assuming passed in Body for simplicity if cookies not used directly by client fetch
    const sessionId = req.cookies?.sessionId || req.body.sessionId;
    const token = req.cookies?.refreshToken || refreshDto.refreshToken;

    const result = await this.authService.refresh(sessionId, { refreshToken: token });

    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'lax' });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });

    return { success: true };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const sessionId = req.cookies?.sessionId || req.body.sessionId;
    if (sessionId) {
      await this.authService.logout(sessionId);
    }
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    return { success: true };
  }
}
