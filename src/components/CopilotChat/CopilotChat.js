import React, { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/styles';
import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
import { useUserEmail } from '../../state/hooks/AuthHooks';
import { useFetchToken, useGetCopilotToken } from '../../state/hooks/CopilotHooks';

const CopilotChat = () => {
  const copilotToken = useGetCopilotToken();

  const fetchToken = useFetchToken();
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const directLine = useMemo(() => (copilotToken ? createDirectLine({ token: copilotToken }) : null), [copilotToken]);

  const userEmail = useUserEmail();

  // Black: 282f33
  // Yellow: ffb118
  // Light Grey : f2f2f2
  // Orange: ed5400
  // grey : 7f7f7f
  // blue: 475c82
  const theme = useTheme();
  const chatStyle = {
    bubbleBackground: theme.palette.copilot.bubbleBackground,
    bubbleBorderRadius: 10,
    bubbleTextColor: theme.palette.copilot.bubbleTextColor,
    bubbleMaxWidth: 1000,
    bubbleFromUserBackground: theme.palette.copilot.bubbleFromUserBackground,
    bubbleFromUserBorderRadius: 10,
    bubbleFromUserMaxWidth: 1000,
    rootHeight: '100%',
    rootWidth: '100%',
    backgroundColor: theme.palette.copilot.backgroundColor,
    bubbleBorderColor: theme.palette.copilot.bubbleBorderColor,
    bubbleFromUserBorderColor: theme.palette.copilot.bubbleFromUserBorderColor,
    sendBoxTextColor: theme.palette.copilot.sendBoxTextColor,
    sendBoxBackground: theme.palette.copilot.sendBoxBackground,
    sendBoxBorderTop: `solid 1px ${theme.palette.copilot.sendBoxBorderTop}`,
  };

  const styleSet = createStyleSet(chatStyle);

  styleSet.textContent.fontFamily = "'Arial', sans-serif";
  styleSet.textContent.fontWeight = 'normal';

  const avatarOptions = {
    botAvatarInitials: 'CSM',
    botAvatarImage: '/cosmofavicon.png',
    userAvatarImage: '/profile_placeholder.png',
    userAvatarInitials: 'YOU',
  };

  if (copilotToken && userEmail) {
    return <ReactWebChat directLine={directLine} userID={userEmail} styleSet={styleSet} styleOptions={avatarOptions} />;
  } else {
    return <div>Waiting for token...</div>;
  }
};

export default CopilotChat;
