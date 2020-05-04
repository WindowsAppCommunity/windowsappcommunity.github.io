import styled from 'styled-components';
import { Depths } from "@uifabric/fluent-theme/lib/fluent/FluentDepths";

export default styled.div`
    box-shadow: ${Depths.depth8};
    :hover {
      box-shadow: ${Depths.depth16};
    };
    transition: 150ms all;
`;