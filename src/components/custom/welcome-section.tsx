import React from "react";

export const WelcomeSection = React.memo(({ username }: { username: string }) => (
  <h1 className="text-4xl font-bold mb-4">Welcome {username}!</h1>
));
