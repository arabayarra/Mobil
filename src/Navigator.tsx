import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddExpenseScreen } from './screens/AddExpenseScreen';
import { GroupDetailScreen } from './screens/GroupDetailScreen';
import { GroupsScreen } from './screens/GroupsScreen';
import { NewGroupScreen } from './screens/NewGroupScreen';
import { useStore } from './store';
import { useTheme } from './theme';

type Route =
  | { name: 'groups' }
  | { name: 'newGroup' }
  | { name: 'group'; groupId: string }
  | { name: 'addExpense'; groupId: string };

export function Navigator() {
  const theme = useTheme();
  const { ready } = useStore();
  const [stack, setStack] = useState<Route[]>([{ name: 'groups' }]);

  const route = stack[stack.length - 1];
  const push = (r: Route) => setStack((prev) => [...prev, r]);
  const pop = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  const resetTo = (routes: Route[]) => setStack(routes);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
      {route.name === 'groups' && (
        <GroupsScreen
          onOpenGroup={(groupId) => push({ name: 'group', groupId })}
          onNewGroup={() => push({ name: 'newGroup' })}
        />
      )}
      {route.name === 'newGroup' && (
        <NewGroupScreen
          onBack={pop}
          onDone={(groupId) => resetTo([{ name: 'groups' }, { name: 'group', groupId }])}
        />
      )}
      {route.name === 'group' && (
        <GroupDetailScreen
          groupId={route.groupId}
          onBack={() => resetTo([{ name: 'groups' }])}
          onAddExpense={() => push({ name: 'addExpense', groupId: route.groupId })}
        />
      )}
      {route.name === 'addExpense' && (
        <AddExpenseScreen groupId={route.groupId} onBack={pop} onDone={pop} />
      )}
    </SafeAreaView>
  );
}
