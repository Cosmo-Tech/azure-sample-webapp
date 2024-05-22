import React, { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/styles';
import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
import { useUserEmail } from '../../state/hooks/AuthHooks';
import { useFetchToken, useGetCopilotToken } from '../../state/hooks/CopilotHooks';

// https://learn.microsoft.com/en-us/azure/bot-service/bot-builder-webchat-customization?view=azure-bot-service-4.0
const CopilotChat = () => {
  const copilotToken = useGetCopilotToken();

  const fetchToken = useFetchToken();
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const directLine = useMemo(() => (copilotToken ? createDirectLine({ token: copilotToken }) : null), [copilotToken]);

  const userEmail = useUserEmail();

  const theme = useTheme();
  const chatStyle = {
    botAvatarBackgroundColor: theme.palette.copilot.backgroundColor,
    bubbleBackground: theme.palette.copilot.bubbleBackground,
    bubbleBorderRadius: 10,
    bubbleTextColor: theme.palette.copilot.bubbleTextColor,
    bubbleMaxWidth: 1000,
    bubbleFromUserBackground: theme.palette.copilot.bubbleFromUserBackground,
    bubbleFromUserTextColor: theme.palette.copilot.bubbleFromUserTextColor,
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
    suggestedActionBackgroundColor: theme.palette.copilot.suggestedActionBackgroundColor,
    suggestedActionHoverBackground: theme.palette.copilot.suggestedActionHoverBackground,
    suggestedActionActiveBackground: theme.palette.copilot.suggestedActionActiveBackground,
    suggestedActionBorderColor: theme.palette.copilot.suggestedActionBorderColor,
    suggestedActionDisabledBackground: theme.palette.copilot.suggestedActionDisabledBackground,
    suggestedActionDisabledBorderColor: theme.palette.copilot.suggestedActionDisabledBorderColor,
    suggestedActionTextColor: theme.palette.copilot.suggestedActionTextColor,
  };

  const styleSet = createStyleSet(chatStyle);

  styleSet.textContent.fontFamily = "'Arial', sans-serif";
  styleSet.textContent.fontWeight = 'normal';

  const avatarOptions = {
    botAvatarInitials: ' ',
    botAvatarImage: theme.palette.copilot.botAvatarImage,
  };

  if (copilotToken && userEmail) {
    return <ReactWebChat directLine={directLine} userID={userEmail} styleSet={styleSet} styleOptions={avatarOptions} />;
  } else {
    return <div>Waiting for token...</div>;
  }
};

export default CopilotChat;
