// src/cookie/cookie.service.spec.ts

import { CookieService } from './cookie.service';
import { COOKIE } from '../constants/enums/cookie/cookie';

describe('CookieService', () => {
  let cookieService: CookieService;

  beforeEach(() => {
    cookieService = new CookieService();
  });

  describe('setUserCookie', () => {
    it('should call res.cookie with correct arguments', () => {
      const res = {
        cookie: jest.fn(),
      };

      const mockToken = 'jwt-token';

      cookieService.setUserCookie(res as any, mockToken);

      expect(res.cookie).toHaveBeenCalledWith(
        COOKIE.TYPE,
        mockToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: COOKIE.SAME_SITE,
          maxAge: COOKIE.MAX_AGE,
        },
      );
    });
  });
});
