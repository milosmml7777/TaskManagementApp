import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TaskProvider, useTasks } from './src/context/TaskContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { useTaskFilters } from './src/hooks/useTaskFilters';
import { SORT_OPTIONS, TASK_CATEGORIES } from './src/utils/constants';
import { formatDate, getTaskStats, isTaskOverdue, truncateText } from './src/utils/taskHelpers';
import type { SortOption, Task, TaskInput, Theme } from './src/utils/types';

type Route =
  | { name: 'dashboard' }
  | { name: 'add' }
  | { name: 'stats' }
  | { name: 'details'; taskId: string }
  | { name: 'edit'; taskId: string };

function getCardChrome(theme: Theme, borderColor: string) {
  const isDark = theme === 'dark';

  return {
    borderColor,
    shadowColor: isDark ? '#020617' : '#0f172a',
    shadowOpacity: isDark ? 0.38 : 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 20 },
    elevation: 8,
  };
}

type ConfirmDialogState = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
};

function AppShell() {
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });
  const { theme, colors, isLoaded: themeLoaded, toggleTheme } = useTheme();
  const { isLoaded: tasksLoaded } = useTasks();

  if (!themeLoaded || !tasksLoaded) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading TaskFlow Native...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.appFrame, { backgroundColor: colors.background }]}>
          <View style={styles.backgroundLayer} pointerEvents="none">
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['#020617', '#0f172a', '#020617']
                  : ['#f8fafc', '#eef4fb', '#f8fafc']
              }
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.backgroundGradient}
            />
            <View
              style={[
                styles.backgroundOrb,
                styles.backgroundOrbLeft,
                { backgroundColor: theme === 'dark' ? 'rgba(45, 212, 191, 0.14)' : 'rgba(249, 115, 22, 0.14)' },
              ]}
            />
            <View
              style={[
                styles.backgroundOrb,
                styles.backgroundOrbRight,
                { backgroundColor: theme === 'dark' ? 'rgba(2, 132, 199, 0.14)' : 'rgba(56, 189, 248, 0.18)' },
              ]}
            />
          </View>

          <TopNav route={route} onNavigate={setRoute} />

          <View style={styles.themeRow}>
            <Text style={[styles.themeLabel, { color: colors.mutedText }]}>
              {theme === 'light' ? 'Light mode' : 'Dark mode'}
            </Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={theme === 'dark' ? colors.accent : '#ffffff'}
            />
          </View>

          {route.name === 'dashboard' ? <DashboardScreen onNavigate={setRoute} /> : null}
          {route.name === 'add' ? <TaskFormScreen onNavigate={setRoute} /> : null}
          {route.name === 'stats' ? <StatsScreen onNavigate={setRoute} /> : null}
          {route.name === 'details' ? (
            <TaskDetailsScreen taskId={route.taskId} onNavigate={setRoute} />
          ) : null}
          {route.name === 'edit' ? (
            <TaskFormScreen taskId={route.taskId} onNavigate={setRoute} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TopNav({
  route,
  onNavigate,
}: {
  route: Route;
  onNavigate: (route: Route) => void;
}) {
  const { colors, theme } = useTheme();

  const navItems: Array<{ label: string; route: Route }> = [
    { label: 'Dashboard', route: { name: 'dashboard' } },
    { label: 'Add Task', route: { name: 'add' } },
    { label: 'Stats', route: { name: 'stats' } },
  ];

  return (
    <View
      style={[
        styles.topNav,
        getCardChrome(theme, colors.border),
        { backgroundColor: colors.card },
      ]}
    >
      <View>
        <Text style={[styles.brandEyebrow, { color: colors.mutedText }]}>TaskFlow Native</Text>
        <Text style={[styles.brandTitle, { color: colors.heading }]}>Expo companion app</Text>
      </View>

      <View style={styles.topNavButtons}>
        {navItems.map((item) => {
          const active = route.name === item.route.name;

          return (
            <Pressable
              key={item.label}
              onPress={() => onNavigate(item.route)}
              style={[
                styles.navButton,
                {
                  backgroundColor: active ? colors.accent : colors.surface,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.navButtonText, { color: active ? colors.onAccent : colors.heading }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    >
      {children}
    </ScrollView>
  );
}

function ScreenHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.pageHeader}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>Task management</Text>
      <Text style={[styles.pageTitle, { color: colors.heading }]}>{title}</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedText }]}>{subtitle}</Text>
    </View>
  );
}

function ConfirmSheet({
  dialog,
  onCancel,
}: {
  dialog: ConfirmDialogState | null;
  onCancel: () => void;
}) {
  const { colors, theme } = useTheme();

  const handleConfirm = () => {
    if (!dialog) {
      return;
    }

    const confirmAction = dialog.onConfirm;
    onCancel();
    confirmAction();
  };

  return (
    <Modal
      visible={dialog !== null}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.modalBackdrop} onPress={onCancel}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[
            styles.confirmCard,
            getCardChrome(theme, colors.border),
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.confirmEyebrow, { color: colors.danger }]}>Confirm delete</Text>
          <Text style={[styles.confirmTitle, { color: colors.heading }]}>{dialog?.title}</Text>
          <Text style={[styles.confirmMessage, { color: colors.mutedText }]}>
            {dialog?.message}
          </Text>
          <View style={styles.confirmActions}>
            <ActionButton label="Cancel" variant="secondary" onPress={onCancel} />
            <ActionButton
              label={dialog?.confirmLabel ?? 'Delete'}
              variant="danger"
              onPress={handleConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DashboardScreen({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const { tasks, deleteTask, deleteSelectedTasks, toggleTaskCompletion } = useTasks();
  const { colors, theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  const visibleTasks = useTaskFilters(tasks, searchTerm, selectedCategory, sortBy);
  const selectedVisibleCount = useMemo(
    () => visibleTasks.filter((task) => selectedIds.includes(task.id)).length,
    [selectedIds, visibleTasks],
  );

  const handleSelectTask = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleDeleteTask = (task: Task) => {
    setConfirmDialog({
      title: `Delete "${task.title}"?`,
      message: 'This task will be removed from your list and cannot be restored from this screen.',
      confirmLabel: 'Delete task',
      onConfirm: () => {
        deleteTask(task.id);
        setSelectedIds((current) => current.filter((item) => item !== task.id));
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      return;
    }

    setConfirmDialog({
      title: `Delete ${selectedIds.length} selected task(s)?`,
      message:
        selectedCategory === 'All'
          ? 'Only the tasks you selected will be deleted. This will not remove every task in the current list.'
          : `Only the tasks you selected in ${selectedCategory} will be deleted. This will not remove the whole category.`,
      confirmLabel: 'Delete selected tasks',
      onConfirm: () => {
        deleteSelectedTasks(selectedIds);
        setSelectedIds([]);
      },
    });
  };

  const bulkSelectionMessage =
    selectedCategory === 'All'
      ? `${visibleTasks.length} shown. ${selectedVisibleCount} selected manually. Only selected task cards will be deleted.`
      : `${visibleTasks.length} shown in ${selectedCategory}. ${selectedVisibleCount} selected manually. Only selected task cards will be deleted, not the whole category.`;

  return (
    <>
      <ScreenContainer>
        <View
          style={[
            styles.heroCard,
            getCardChrome(theme, colors.border),
            styles.heroCardBackground,
          ]}
        >
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['rgba(15, 23, 42, 0.96)', 'rgba(15, 23, 42, 0.96)']
                : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.9)']
            }
            style={styles.heroBase}
          />
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['rgba(14, 116, 144, 0.12)', 'rgba(45, 212, 191, 0.08)']
                : ['rgba(14, 116, 144, 0.12)', 'rgba(249, 115, 22, 0.12)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroLinearGlow}
          />
          <View
            style={[
              styles.heroGlow,
              { backgroundColor: theme === 'dark' ? 'rgba(45, 212, 191, 0.16)' : 'rgba(56, 189, 248, 0.18)' },
            ]}
          />
          <View
            style={[
              styles.heroGlow,
              styles.heroGlowWarm,
              { backgroundColor: theme === 'dark' ? 'rgba(45, 212, 191, 0.08)' : 'rgba(249, 115, 22, 0.12)' },
            ]}
          />
          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, { color: colors.heading }]}>
              Stay on top of every task with a clean native workflow.
            </Text>
            <Text style={[styles.heroDescription, { color: colors.mutedText }]}>
              Track deadlines, search quickly, filter categories, and manage your day from an Expo app.
            </Text>
          </View>

          <View style={styles.heroButtons}>
            <ActionButton label="Add task" onPress={() => onNavigate({ name: 'add' })} />
            <ActionButton
              label="View stats"
              variant="secondary"
              onPress={() => onNavigate({ name: 'stats' })}
            />
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            getCardChrome(theme, colors.border),
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.controlSection}>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>Find tasks</Text>
            <Text style={[styles.controlTitle, { color: colors.heading }]}>
              Search, filter, and sort your list
            </Text>

            <Text style={[styles.sectionLabel, { color: colors.heading }]}>Search tasks</Text>
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search title or description"
              placeholderTextColor={colors.placeholder}
              style={[
                styles.textInput,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            />

            <Text style={[styles.sectionLabel, styles.spacedLabel, { color: colors.heading }]}>
              Filter by category
            </Text>
            <ChipRow
              items={['All', ...TASK_CATEGORIES]}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <Text style={[styles.sectionLabel, styles.spacedLabel, { color: colors.heading }]}>
              Sort tasks
            </Text>
            <ChipRow
              items={SORT_OPTIONS.map((option) => option.value)}
              selected={sortBy}
              labels={Object.fromEntries(SORT_OPTIONS.map((option) => [option.value, option.label]))}
              onSelect={(value) => setSortBy(value as SortOption)}
            />
          </View>

          <View
            style={[
              styles.selectionPanel,
              { backgroundColor: colors.surfaceStrong, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.eyebrow, { color: colors.accent }]}>Selected tasks</Text>
            <Text style={[styles.toolbarCopy, { color: colors.mutedText }]}>
              {bulkSelectionMessage}
            </Text>
            <ActionButton
              label="Delete selected tasks"
              variant="danger"
              disabled={selectedIds.length === 0}
              onPress={handleBulkDelete}
            />
          </View>
        </View>

        {visibleTasks.length === 0 ? (
          <View
            style={[
              styles.sectionCard,
              getCardChrome(theme, colors.border),
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.heading }]}>No tasks yet</Text>
            <Text style={[styles.emptyCopy, { color: colors.mutedText }]}>
              Add your first task to start tracking work, study, and personal goals.
            </Text>
          </View>
        ) : (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedIds.includes(task.id)}
              onSelect={() => handleSelectTask(task.id)}
              onView={() => onNavigate({ name: 'details', taskId: task.id })}
              onEdit={() => onNavigate({ name: 'edit', taskId: task.id })}
              onToggleCompletion={() => toggleTaskCompletion(task.id)}
              onDelete={() => handleDeleteTask(task)}
            />
          ))
        )}
      </ScreenContainer>

      <ConfirmSheet dialog={confirmDialog} onCancel={() => setConfirmDialog(null)} />
    </>
  );
}

function TaskCard({
  task,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onToggleCompletion,
  onDelete,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onToggleCompletion: () => void;
  onDelete: () => void;
}) {
  const { colors, theme } = useTheme();
  const overdue = isTaskOverdue(task);
  const statusLabel = task.completed ? 'Completed' : overdue ? 'Overdue' : 'Mark complete';
  const statusColor = task.completed ? colors.success : overdue ? colors.danger : colors.accent;
  const titlePreview = truncateText(task.title, 50);
  const descriptionPreview = task.description
    ? truncateText(task.description, 50)
    : 'No description provided.';

  return (
    <View
      style={[
        styles.taskCard,
        getCardChrome(theme, isSelected ? colors.accent : colors.border),
        {
          backgroundColor: isSelected ? colors.accentSoft : colors.card,
        },
      ]}
    >
      <View style={styles.taskCardTop}>
        <Pressable
          onPress={onSelect}
          style={[
            styles.selectBadge,
            {
              backgroundColor: isSelected ? colors.card : colors.surfaceStrong,
              borderColor: isSelected ? colors.accent : colors.border,
            },
          ]}
        >
          <Text style={[styles.selectBadgeText, { color: colors.heading }]}>
            {isSelected ? 'Selected for bulk actions' : 'Select task'}
          </Text>
        </Pressable>

        <Pressable
          onPress={onToggleCompletion}
          style={[styles.statusButton, { backgroundColor: statusColor }]}
        >
          <Text style={[styles.statusButtonText, { color: colors.onAccent }]}>{statusLabel}</Text>
        </Pressable>
      </View>

      <Pressable onPress={onView}>
        <Text
          style={[
            styles.taskTitle,
            { color: colors.heading, textDecorationLine: task.completed ? 'line-through' : 'none' },
          ]}
        >
          {titlePreview}
        </Text>
        <Text style={[styles.taskDescription, { color: colors.mutedText }]}>
          {descriptionPreview}
        </Text>
      </Pressable>

      <View style={styles.metaRow}>
        <Text style={[styles.metaPill, { color: colors.heading, backgroundColor: colors.surfaceStrong }]}>
          {task.category}
        </Text>
        <Text style={[styles.metaPill, { color: colors.heading, backgroundColor: colors.surfaceStrong }]}>
          Due {formatDate(task.dueDate)}
        </Text>
      </View>

      <View style={styles.actionsCluster}>
        <ActionButton label="View" variant="secondary" onPress={onView} />
        <ActionButton label="Edit" variant="secondary" onPress={onEdit} />
        <ActionButton label="Delete" variant="danger" onPress={onDelete} />
      </View>
    </View>
  );
}

function TaskDetailsScreen({
  taskId,
  onNavigate,
}: {
  taskId: string;
  onNavigate: (route: Route) => void;
}) {
  const { deleteTask, getTaskById, toggleTaskCompletion } = useTasks();
  const { colors, theme } = useTheme();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <ScreenContainer>
        <View
          style={[
            styles.sectionCard,
            getCardChrome(theme, colors.border),
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: colors.heading }]}>Task not found</Text>
          <Text style={[styles.emptyCopy, { color: colors.mutedText }]}>
            The requested task could not be found anymore.
          </Text>
          <ActionButton label="Back to dashboard" onPress={() => onNavigate({ name: 'dashboard' })} />
        </View>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    setConfirmDialog({
      title: `Delete "${task.title}"?`,
      message: 'This task will be removed from your dashboard and you will be taken back to the main list.',
      confirmLabel: 'Delete task',
      onConfirm: () => {
        deleteTask(task.id);
        onNavigate({ name: 'dashboard' });
      },
    });
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader
          title={task.title}
          subtitle="Review details, update progress, or jump into editing."
        />

        <View
          style={[
            styles.sectionCard,
            getCardChrome(theme, colors.border),
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <ActionButton
            label={task.completed ? 'Completed' : 'Mark complete'}
            onPress={() => toggleTaskCompletion(task.id)}
          />

          <DetailRow
            label="Description"
            value={task.description || 'No description provided.'}
            expanded
          />
          <DetailRow label="Due date" value={formatDate(task.dueDate)} />
          <DetailRow label="Category" value={task.category} />
          <DetailRow label="Completed" value={task.completed ? 'Yes' : 'No'} />
          <DetailRow label="Created at" value={formatDate(task.createdAt)} />

          <View style={styles.actionsCluster}>
            <ActionButton
              label="Edit task"
              variant="secondary"
              onPress={() => onNavigate({ name: 'edit', taskId })}
            />
            <ActionButton label="Delete task" variant="danger" onPress={handleDelete} />
          </View>
        </View>
      </ScreenContainer>

      <ConfirmSheet dialog={confirmDialog} onCancel={() => setConfirmDialog(null)} />
    </>
  );
}

function DetailRow({
  label,
  value,
  expanded = false,
}: {
  label: string;
  value: string;
  expanded?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.detailRow, expanded ? styles.detailRowExpanded : null]}>
      <Text style={[styles.detailLabel, { color: colors.mutedText }]}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          expanded ? styles.detailValueExpanded : null,
          { color: colors.heading },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function TaskFormScreen({
  taskId,
  onNavigate,
}: {
  taskId?: string;
  onNavigate: (route: Route) => void;
}) {
  const { addTask, getTaskById, updateTask } = useTasks();
  const { colors, theme } = useTheme();
  const existingTask = taskId ? getTaskById(taskId) : undefined;

  if (taskId && !existingTask) {
    return (
      <ScreenContainer>
        <View
          style={[
            styles.sectionCard,
            getCardChrome(theme, colors.border),
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: colors.heading }]}>Task not found</Text>
          <Text style={[styles.emptyCopy, { color: colors.mutedText }]}>
            The task you are trying to edit does not exist anymore.
          </Text>
          <ActionButton label="Back to dashboard" onPress={() => onNavigate({ name: 'dashboard' })} />
        </View>
      </ScreenContainer>
    );
  }

  const handleSubmit = (taskInput: TaskInput) => {
    if (existingTask && taskId) {
      updateTask(taskId, taskInput);
      onNavigate({ name: 'details', taskId });
      return;
    }

    addTask(taskInput);
    onNavigate({ name: 'dashboard' });
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={existingTask ? 'Update your task' : 'Add a new task'}
        subtitle="Keep the same task rules as the web app, adapted for a native form."
      />

      <TaskForm
        initialTask={existingTask}
        submitLabel={existingTask ? 'Save changes' : 'Create task'}
        onSubmit={handleSubmit}
      />
    </ScreenContainer>
  );
}

function TaskForm({
  initialTask,
  onSubmit,
  submitLabel,
}: {
  initialTask?: Task;
  onSubmit: (taskInput: TaskInput) => void;
  submitLabel: string;
}) {
  const { colors, theme } = useTheme();
  const [title, setTitle] = useState((initialTask?.title ?? '').slice(0, 30));
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? '');
  const [category, setCategory] = useState(initialTask?.category ?? TASK_CATEGORIES[0]);
  const [titleError, setTitleError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shakeAnimation] = useState(() => new Animated.Value(0));
  const [limitFeedbackAnimation] = useState(() => new Animated.Value(0));
  const titleLimitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parsedDueDate = dueDate ? new Date(dueDate) : new Date();
  const pickerDate = Number.isNaN(parsedDueDate.getTime()) ? new Date() : parsedDueDate;
  const animatedTitleBorderColor = limitFeedbackAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [titleError ? colors.danger : colors.border, colors.danger],
  });
  const animatedCounterColor = limitFeedbackAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.mutedText, colors.danger],
  });
  const animatedTitleTranslateX = shakeAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [0, -8, 7, -5, 3, 0],
  });

  useEffect(() => {
    return () => {
      if (titleLimitTimeoutRef.current !== null) {
        clearTimeout(titleLimitTimeoutRef.current);
      }
    };
  }, []);

  const triggerTitleLimitFeedback = () => {
    if (titleLimitTimeoutRef.current !== null) {
      clearTimeout(titleLimitTimeoutRef.current);
    }

    shakeAnimation.stopAnimation();
    limitFeedbackAnimation.stopAnimation();
    shakeAnimation.setValue(0);
    limitFeedbackAnimation.setValue(1);

    Animated.timing(shakeAnimation, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    titleLimitTimeoutRef.current = setTimeout(() => {
      Animated.timing(limitFeedbackAnimation, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, 550);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }

    if (event.type !== 'set' || !selectedDate) {
      return;
    }

    const nextValue = selectedDate.toISOString().slice(0, 10);
    setDueDate(nextValue);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }

    onSubmit({
      title,
      description,
      dueDate,
      category,
    });
  };

  return (
    <View
      style={[
        styles.sectionCard,
        getCardChrome(theme, colors.border),
        { backgroundColor: colors.card },
      ]}
    >
      <View style={styles.fieldRow}>
        <Text style={[styles.sectionLabel, styles.inlineFieldLabel, { color: colors.heading }]}>Title</Text>
        <Animated.Text style={[styles.helperText, styles.counterTextTop, { color: animatedCounterColor }]}>
          {title.length}/30
        </Animated.Text>
      </View>
      <Animated.View
        style={[
          styles.titleInputShell,
          {
            backgroundColor: colors.background,
            borderColor: animatedTitleBorderColor,
            transform: [{ translateX: animatedTitleTranslateX }],
          },
        ]}
      >
        <TextInput
          value={title}
          onChangeText={(value) => {
            setTitle(value.slice(0, 30));
            if (value.trim()) {
              setTitleError('');
            }
          }}
          onKeyPress={({ nativeEvent }) => {
            if (title.length >= 30 && nativeEvent.key.length === 1) {
              triggerTitleLimitFeedback();
            }
          }}
          maxLength={30}
          placeholder="Finish React project"
          placeholderTextColor={colors.placeholder}
          style={[
            styles.textInput,
            styles.titleInputInner,
            {
              color: colors.heading,
            },
          ]}
        />
      </Animated.View>
      {titleError ? <Text style={[styles.errorText, { color: colors.danger }]}>{titleError}</Text> : null}

      <Text style={[styles.sectionLabel, styles.spacedLabel, { color: colors.heading }]}>Description</Text>
      <TextInput
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
        placeholder="Add notes, checklist items, or context"
        placeholderTextColor={colors.placeholder}
        style={[
          styles.textInput,
          styles.multilineInput,
          { color: colors.heading, borderColor: colors.border, backgroundColor: colors.background },
        ]}
      />

      <Text style={[styles.sectionLabel, styles.spacedLabel, { color: colors.heading }]}>Due date</Text>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          setShowDatePicker(true);
        }}
        style={[
          styles.textInput,
          styles.dateInput,
          { borderColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.dateInputText, { color: dueDate ? colors.heading : colors.placeholder }]}>
          {dueDate ? formatDate(dueDate) : 'Select a due date'}
        </Text>
      </Pressable>

      {showDatePicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      ) : null}

      <Text style={[styles.helperText, { color: colors.mutedText }]}>
        Saved as {dueDate || 'no date selected'}.
      </Text>

      <Text style={[styles.sectionLabel, styles.spacedLabel, { color: colors.heading }]}>Category</Text>
      <ChipRow items={TASK_CATEGORIES as unknown as string[]} selected={category} onSelect={setCategory} />

      <View style={styles.formActions}>
        <ActionButton label={submitLabel} onPress={handleSubmit} />
      </View>
    </View>
  );
}

function StatsScreen({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const { tasks } = useTasks();
  const { colors, theme } = useTheme();
  const stats = getTaskStats(tasks);

  return (
    <ScreenContainer>
      <ScreenHeader
        title="See how your workload is trending."
        subtitle="These stats are calculated from the same task model used across the app."
      />

      <View style={styles.statsGrid}>
        <StatsCard label="Total tasks" value={stats.total} accent />
        <StatsCard label="Completed" value={stats.completed} />
        <StatsCard label="Active" value={stats.active} />
        <StatsCard label="Overdue" value={stats.overdue} />
        <StatsCard label="Completion rate" value={`${stats.completionPercentage}%`} />
      </View>

      <View
        style={[
          styles.sectionCard,
          getCardChrome(theme, colors.border),
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.heading }]}>Category distribution</Text>
          <ActionButton label="Back" variant="secondary" onPress={() => onNavigate({ name: 'dashboard' })} />
        </View>

        {stats.categoryDistribution.length === 0 ? (
          <Text style={[styles.emptyCopy, { color: colors.mutedText }]}>
            Add tasks to see category distribution.
          </Text>
        ) : (
          stats.categoryDistribution.map((item) => (
            <View key={item.category} style={styles.distributionItem}>
              <View style={styles.distributionRow}>
                <Text style={[styles.distributionLabel, { color: colors.heading }]}>{item.category}</Text>
                <Text style={[styles.distributionMeta, { color: colors.mutedText }]}>
                  {item.count} task(s) - {item.percentage}%
                </Text>
              </View>
              <View style={[styles.distributionTrack, { backgroundColor: colors.surfaceStrong }]}>
                <LinearGradient
                  colors={[colors.accent, '#f97316']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.distributionFill, { width: `${item.percentage}%` }]}
                />
              </View>
            </View>
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

function StatsCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  const { colors, theme } = useTheme();

  return (
    <View
      style={[
        styles.statsCard,
        getCardChrome(theme, accent ? colors.accent : colors.border),
        {
          backgroundColor: accent ? colors.accent : colors.card,
        },
      ]}
    >
      <Text style={[styles.statsValue, { color: accent ? colors.onAccent : colors.heading }]}>{value}</Text>
      <Text style={[styles.statsLabel, { color: accent ? colors.onAccent : colors.mutedText }]}>
        {label}
      </Text>
    </View>
  );
}

function ChipRow({
  items,
  selected,
  onSelect,
  labels,
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  labels?: Record<string, string>;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.chipRow}>
      {items.map((item) => {
        const active = item === selected;

        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.accent : colors.surface,
                borderColor: active ? colors.accent : colors.border,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: active ? colors.onAccent : colors.heading }]}>
              {labels?.[item] ?? item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
        ? colors.dangerSoft
        : colors.surfaceStrong;
  const borderColor =
    variant === 'primary' ? colors.accent : variant === 'danger' ? colors.dangerSoft : colors.surfaceStrong;
  const textColor =
    variant === 'primary' ? colors.onAccent : variant === 'danger' ? colors.danger : colors.heading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionButton,
        {
          backgroundColor: disabled ? colors.border : backgroundColor,
          borderColor: disabled ? colors.border : borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text style={[styles.actionButtonText, { color: disabled ? colors.mutedText : textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppShell />
      </TaskProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  backgroundOrbLeft: {
    top: -60,
    left: -90,
  },
  backgroundOrbRight: {
    top: 180,
    right: -110,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  appFrame: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
  },
  topNav: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  brandEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  topNavButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  navButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  screenContent: {
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  pageHeader: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCardBackground: {
    minHeight: 180,
  },
  heroBase: {
    ...StyleSheet.absoluteFillObject,
  },
  heroLinearGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    top: -80,
    right: -40,
  },
  heroGlowWarm: {
    width: 260,
    height: 260,
    top: 40,
    right: 120,
  },
  heroCopy: {
    gap: 10,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 23,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    zIndex: 1,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  controlSection: {
    gap: 6,
  },
  controlTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inlineFieldLabel: {
    marginBottom: 0,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  spacedLabel: {
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  titleInputShell: {
    borderWidth: 1,
    borderRadius: 16,
  },
  titleInputInner: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateInputText: {
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 112,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  counterText: {
    marginTop: 6,
  },
  counterTextTop: {
    marginTop: 0,
  },
  errorText: {
    fontSize: 13,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectionPanel: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  toolbarRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  toolbarCopy: {
    fontSize: 14,
    flexShrink: 1,
    lineHeight: 21,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyCopy: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  taskCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 14,
    overflow: 'hidden',
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  selectBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  statusButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaPill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  actionsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  detailRow: {
    marginTop: 16,
    gap: 6,
  },
  detailRowExpanded: {
    minHeight: 120,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 23,
  },
  detailValueExpanded: {
    lineHeight: 26,
  },
  formActions: {
    marginTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    minWidth: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statsLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  distributionItem: {
    marginTop: 16,
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  distributionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  distributionMeta: {
    fontSize: 14,
  },
  distributionTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 999,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  confirmCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  confirmEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  confirmTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  confirmMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
});
