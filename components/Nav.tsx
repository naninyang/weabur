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

const Container = styled.header({
  display: 'flex',
  alignItems: 'center',
  gap: rem(25),
  padding: rem(25),
  [mq.maxSmall]: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  '& strong, & > a': {
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

const Item = styled.li<ItemProps>(({ currentRouter }) => ({
  '& a': {
    fontWeight: currentRouter ? 500 : 300,
    opacity: currentRouter ? undefined : 0.7,
  },
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

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: `(min-width: ${rem(768)})` });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export default function Nav() {
  const router = useRouter();
  const home =
    router.pathname === '/' ||
    router.pathname === '/misc' ||
    router.pathname === '/seoul' ||
    router.pathname === '/daejeon';

  const [isActive, setIsActive] = useState<boolean>(false);
  const openMenu = () => {
    setIsActive(true);
  };
  const closeMenu = () => {
    setIsActive(false);
  };

  const isDesktop = useDesktop();

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  return (
    <Container>
      {router.pathname === '/' ||
      router.pathname === '/misc' ||
      router.pathname === '/seoul' ||
      router.pathname === '/daejeon' ? (
        <strong>
          <span>날씨와 버스 정보를 한번에! 웨버</span>
          <Weabur />
        </strong>
      ) : (
        <>
          {currentPage ? (
            <Anchor href={`/${currentPage}`}>
              <span>서비스 화면으로 이동</span>
              <Weabur />
            </Anchor>
          ) : (
            <Anchor href="/">
              <span>서비스 화면으로 이동</span>
              <Weabur />
            </Anchor>
          )}
        </>
      )}
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
                <Item
                  currentRouter={
                    router.pathname === '/' ||
                    router.pathname === '/misc' ||
                    router.pathname === '/seoul' ||
                    router.pathname === '/daejeon'
                      ? true
                      : false
                  }
                >
                  {currentPage ? (
                    <Anchor
                      href={`/${currentPage}`}
                      aria-current={
                        router.pathname === '/' ||
                        router.pathname === '/misc' ||
                        router.pathname === '/seoul' ||
                        router.pathname === '/daejeon'
                          ? true
                          : false
                      }
                    >
                      서비스 이용
                    </Anchor>
                  ) : (
                    <Anchor
                      href="/"
                      aria-current={
                        router.pathname === '/' ||
                        router.pathname === '/misc' ||
                        router.pathname === '/seoul' ||
                        router.pathname === '/daejeon'
                          ? true
                          : false
                      }
                    >
                      서비스 이용
                    </Anchor>
                  )}
                </Item>
              )}
              <Item currentRouter={router.pathname === '/service' ? true : false}>
                <Anchor href="/service" aria-current={router.pathname === '/service' ? true : false}>
                  서비스 소개
                </Anchor>
              </Item>
              <Item currentRouter={router.pathname === '/open-sources' ? true : false}>
                <Anchor href="/open-sources" aria-current={router.pathname === '/open-sources' ? true : false}>
                  오픈소스
                </Anchor>
              </Item>
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
                <Item
                  currentRouter={
                    router.pathname === '/' ||
                    router.pathname === '/misc' ||
                    router.pathname === '/seoul' ||
                    router.pathname === '/daejeon'
                      ? true
                      : false
                  }
                >
                  <Anchor
                    href="/"
                    aria-current={
                      router.pathname === '/' ||
                      router.pathname === '/misc' ||
                      router.pathname === '/seoul' ||
                      router.pathname === '/daejeon'
                        ? true
                        : false
                    }
                  >
                    서비스 이용
                  </Anchor>
                </Item>
              )}
              <Item currentRouter={router.pathname === '/service' ? true : false}>
                <Anchor href="/service" aria-current={router.pathname === '/service' ? true : false}>
                  서비스 소개
                </Anchor>
              </Item>
              <Item currentRouter={router.pathname === '/open-sources' ? true : false}>
                <Anchor href="/open-sources" aria-current={router.pathname === '/open-sources' ? true : false}>
                  오픈소스
                </Anchor>
              </Item>
            </ol>
          )}
        </>
      )}
    </Container>
  );
}
