export interface IPageAction {
  // unique identifier for the action for particular page
  actionName: string;
  // display name shows up in button
  displayName?: string;
  // icon to display for the action
  icon?: string;
  // is disabled this action
  disabled?: boolean;
  // callback action to run
  callback?: () => any;
}

