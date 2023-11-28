import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import { images } from '@/images';
import Anchor from './Anchor';
import { rem, mixIn, hex, mq } from '@/styles/designSystem';

type ItemProps = {
  currentRouter?: boolean;
};

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: rem(25),
  padding: rem(25),
  [mq.maxSmall]: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  '& strong': {
    display: 'inline-block',
    width: rem(70),
    height: rem(25),
    '& span': {
      ...mixIn.screenReaderOnly,
    },
    '& i': {
      display: 'inline-block',
      width: rem(70),
      height: rem(25),
    },
  },
  '& hr': {
    margin: 0,
    height: rem(20),
    border: 0,
    borderRight: `${rem(2)} solid transparent`,
    borderLeft: `${rem(2)} solid transparent`,
  },
  '& button': {
    background: 'none',
    width: rem(25),
    height: rem(25),
    [mq.maxSmall]: {
      position: 'absolute',
      top: rem(25),
      right: rem(25),
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
    '& i': {
      display: 'inline-block',
      width: rem(25),
      height: rem(25),
    },
  },
  '& ol': {
    display: 'flex',
    gap: rem(12),
    [mq.maxSmall]: {
      width: '100%',
      justifyContent: 'flex-end',
    },
    [mq.minMedium]: {
      gap: rem(25),
    },
    '& li': {
      '& a': {
        fontSize: rem(16),
        fontFamily:
          "Pretendard, 'Apple SD Gothic Neo',-apple-system,BlinkMacSystemFont,system-ui,'Nanum Gothic','Malgun Gothic',sans-serif",
        lineHeight: 1.25,
        letterSpacing: '-.07em',
        color: hex.white,
        [mq.minMedium]: {
          fontSize: rem(20),
        },
        '&:hover, &:focus': {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: `(min-width: ${rem(768)})` });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

const Item = styled(Anchor)<ItemProps>(({ currentRouter }) => ({
  fontWeight: currentRouter ? 500 : 300,
  opacity: currentRouter ? undefined : 0.7,
}));

const ButtonMenu = styled.button({});

const ButtonClose = styled.button({});

const Weabur = styled.i({
  background: `url(${images.misc.logo}) no-repeat 50% 50%/contain`,
});

const Menu = styled.i({
  background: `url(${images.misc.menu}) no-repeat 50% 50%/contain`,
});

const Close = styled.i({
  background: `url(${images.misc.cross}) no-repeat 50% 50%/contain`,
});

const MenuBefore = styled.hr({
  borderRight: `${rem(2)} solid ${hex.fuchsia} !important`,
  borderLeft: `${rem(2)} solid ${hex.fuchsia} !important`,
});

const MenuAfter = styled.hr({
  borderRight: `${rem(2)} solid ${hex.fuchsia} !important`,
  borderLeft: `${rem(2)} solid ${hex.fuchsia} !important`,
});

export default function Nav() {
  const router = useRouter();
  const home = router.pathname === '/';

  const [isActive, setIsActive] = useState<boolean>(false);
  const openMenu = () => {
    setIsActive(true);
  };
  const closeMenu = () => {
    setIsActive(false);
  };

  const isDesktop = useDesktop();

  return (
    <Container>
      <strong>
        <span>웨버 WeaBur</span>
        <Weabur />
      </strong>
      {isDesktop ? (
        <>
          {isActive ? (
            <>
              <hr />
              <ButtonClose type="button" onClick={closeMenu}>
                <span>메뉴 닫기</span>
                <Close />
              </ButtonClose>
              <MenuAfter />
            </>
          ) : (
            <>
              <MenuBefore />
              <ButtonMenu type="button" onClick={openMenu}>
                <span>메뉴 열기</span>
                <Menu />
              </ButtonMenu>
            </>
          )}
          {isActive && (
            <ol>
              {!home && (
                <li>
                  <Item
                    href="/"
                    aria-current={router.pathname === '/' ? true : false}
                    currentRouter={router.pathname === '/' ? true : false}
                  >
                    서비스 이용
                  </Item>
                </li>
              )}
              <li>
                <Item
                  href="/service"
                  aria-current={router.pathname === '/service' ? true : false}
                  currentRouter={router.pathname === '/service' ? true : false}
                >
                  서비스 소개
                </Item>
              </li>
              <li>
                <Item
                  href="/open-sources"
                  aria-current={router.pathname === '/open-sources' ? true : false}
                  currentRouter={router.pathname === '/open-sources' ? true : false}
                >
                  오픈소스
                </Item>
              </li>
            </ol>
          )}
        </>
      ) : (
        <>
          {isActive ? (
            <>
              <ButtonClose type="button" onClick={closeMenu}>
                <span>메뉴 닫기</span>
                <Close />
              </ButtonClose>
            </>
          ) : (
            <ButtonMenu type="button" onClick={openMenu}>
              <span>메뉴 열기</span>
              <Menu />
            </ButtonMenu>
          )}
          {isActive && (
            <ol>
              {!home && (
                <li>
                  <Item
                    href="/"
                    aria-current={router.pathname === '/' ? true : false}
                    currentRouter={router.pathname === '/' ? true : false}
                  >
                    서비스 이용
                  </Item>
                </li>
              )}
              <li>
                <Item
                  href="/service"
                  aria-current={router.pathname === '/service' ? true : false}
                  currentRouter={router.pathname === '/service' ? true : false}
                >
                  서비스 소개
                </Item>
              </li>
              <li>
                <Item
                  href="/contact-us"
                  aria-current={router.pathname === '/contact-us' ? true : false}
                  currentRouter={router.pathname === '/contact-us' ? true : false}
                >
                  문의하기
                </Item>
              </li>
              <li>
                <Item
                  href="/open-sources"
                  aria-current={router.pathname === '/open-sources' ? true : false}
                  currentRouter={router.pathname === '/open-sources' ? true : false}
                >
                  오픈소스
                </Item>
              </li>
            </ol>
          )}
        </>
      )}
    </Container>
  );
}
