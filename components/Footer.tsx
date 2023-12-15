import styled from '@emotion/styled';
import Anchor from './Anchor';
import { images } from '@/images';
import { mq, mixIn, vw, hex } from '@/styles/designSystem';

const Container = styled.footer({
  display: 'flex',
  padding: `${vw(21, 430)} ${vw(25, 430)}`,
  [mq.maxSmall]: {
    flexDirection: 'column',
    gap: vw(15, 430),
  },
  [mq.minMedium]: {
    justifyContent: 'space-between',
    padding: `${vw(21, 1920)} ${vw(25, 1920)}`,
  },
  '& .copyrights': {
    display: 'flex',
    gap: vw(7, 430),
    [mq.minMedium]: {
      gap: vw(15, 1920),
    },
    '& p': {
      ...mixIn.colAuto,
      fontSize: vw(16, 430),
      lineHeight: 1,
      [mq.minMedium]: {
        fontSize: vw(24, 1920),
      },
      '&:first-of-type::after': {
        content: "'•'",
        paddingLeft: vw(7, 430),
        [mq.minMedium]: {
          paddingLeft: vw(15, 1920),
        },
      },
    },
    '& ul': {
      display: 'flex',
      gap: vw(2, 430),
      fontSize: vw(16, 430),
      lineHeight: 1,
      [mq.minMedium]: {
        fontSize: vw(24, 1920),
      },
      '&::before': {
        content: "'•'",
      },
      '& li': {
        fontSize: vw(16, 430),
        lineHeight: 1,
        [mq.minMedium]: {
          fontSize: vw(24, 1920),
        },
        '&::after': {
          content: "'/'",
          paddingLeft: vw(5, 430),
          [mq.minMedium]: {
            paddingLeft: vw(12, 1920),
          },
        },
        '&:last-of-type::after': {
          display: 'none',
        },
      },
      '& a': {
        color: hex.white,
        fontSize: vw(16, 430),
        lineHeight: 1,
        [mq.minMedium]: {
          fontSize: vw(24, 1920),
        },
      },
    },
  },
  '& .sites': {
    display: 'flex',
    [mq.minMedium]: {
      justifyContent: 'flex-end',
    },
    '& ul': {
      display: 'flex',
      gap: vw(15, 430),
      [mq.minMedium]: {
        gap: vw(15, 1920),
      },
      '& li': {
        '& span': {
          ...mixIn.screenReaderOnly,
        },
        '& i': {
          display: 'block',
          width: vw(16, 430),
          height: vw(16, 430),
          [mq.minMedium]: {
            width: vw(24, 1920),
            height: vw(24, 1920),
          },
        },
      },
    },
  },
});

const Dev1studio = styled.i({
  background: `url(${images.family.dev1studio}) no-repeat 50% 50%/contain`,
});

const Develog = styled.i({
  background: `url(${images.family.develog}) no-repeat 50% 50%/contain`,
});

const Github = styled.i({
  background: `url(${images.family.github}) no-repeat 50% 50%/contain`,
});

const Postype = styled.i({
  background: `url(${images.family.postype}) no-repeat 50% 50%/contain`,
});

const Velog = styled.i({
  background: `url(${images.family.velog}) no-repeat 50% 50%/contain`,
});

export default function Footer() {
  return (
    <Container>
      <div className="copyrights">
        <p>Copyrights WeaBur</p>
        <p>저작권자 웨버</p>
        <ul>
          <li>
            <Anchor href="/misc">서울웨버</Anchor>
          </li>
          <li>
            <Anchor href="/misc">대전웨버</Anchor>
          </li>
          <li>
            <Anchor href="/misc">지역웨버</Anchor>
          </li>
        </ul>
      </div>
      <div className="sites">
        <ul>
          <li>
            <Anchor href="https://github.com/naninyang/weabur">
              <span>Github Repo</span>
              <Github />
            </Anchor>
          </li>
          <li>
            <Anchor href="https://dev1stud.io">
              <span>DEV1L.studio</span>
              <Dev1studio />
            </Anchor>
          </li>
          <li>
            <Anchor href="https://develog.dev1stud.io">
              <span>Develog</span>
              <Develog />
            </Anchor>
          </li>
          <li>
            <Anchor href="https://dev-il-studio.postype.com">
              <span>Postype</span>
              <Postype />
            </Anchor>
          </li>
          <li>
            <Anchor href="https://velog.io/@naninyang">
              <span>Velog</span>
              <Velog />
            </Anchor>
          </li>
        </ul>
      </div>
    </Container>
  );
}
