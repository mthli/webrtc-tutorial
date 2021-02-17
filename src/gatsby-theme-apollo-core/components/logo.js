import React from 'react';
import styled from '@emotion/styled';

import { withPrefix } from 'gatsby';

const Wrapper = styled.div({
  display: 'flex',
  marginTop: '-4px',
});

export default function Logo() {
  return (
    <Wrapper>
      <img
        style={{ maxWidth: '32px' }}
        src={withPrefix('/icons/icon-96x96.png')}
        alt={'logo'}
      />
    </Wrapper>
  );
}
