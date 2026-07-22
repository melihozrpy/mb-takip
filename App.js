import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'mb-takip/native-dashboard';
const DAY = 24 * 60 * 60 * 1000;

const today = new Date();
const isoDaysFromNow = (days) => {
  const date = new Date(today.getTime() + days * DAY);
  return date.toISOString();
};

const seedData = {
  sectors: [
    { id: 'transport', name: 'Tasima', color: '#14b8a6', icon: 'TR' },
    { id: 'consulting', name: 'Musavirlik', color: '#6366f1', icon: 'MS' },
    { id: 'construction', name: 'Insaat', color: '#f59e0b', icon: 'IN' },
    { id: 'commerce', name: 'E-Ticaret', color: '#ef4444', icon: 'ET' },
    { id: 'service', name: 'Servis', color: '#22c55e', icon: 'SV' },
    { id: 'property', name: 'Emlak', color: '#0ea5e9', icon: 'EM' }
  ],
  customers: [
    {
      id: 'c1',
      name: 'Atlas Lojistik',
      company: 'Atlas Nakliyat A.S.',
      sectorId: 'transport',
      status: 'active',
      priority: 'hot',
      estimatedValue: 185000,
      lastContactAt: isoDaysFromNow(-3),
      createdAt: isoDaysFromNow(-2),
      note: 'Haftalik sevkiyat teklifi bekliyor.'
    },
    {
      id: 'c2',
      name: 'Deniz Proje',
      company: 'Deniz Muhendislik',
      sectorId: 'consulting',
      status: 'proposal',
      priority: 'normal',
      estimatedValue: 92000,
      lastContactAt: isoDaysFromNow(-18),
      createdAt: isoDaysFromNow(-11),
      note: 'Sozlesme revizyonu gonderilecek.'
    },
    {
      id: 'c3',
      name: 'Mert Yapi',
      company: 'Mert Yapi Market',
      sectorId: 'construction',
      status: 'active',
      priority: 'hot',
      estimatedValue: 124000,
      lastContactAt: isoDaysFromNow(-1),
      createdAt: isoDaysFromNow(-5),
      note: 'Saha teslim tarihi netlesecek.'
    },
    {
      id: 'c4',
      name: 'Nova Shop',
      company: 'Nova Dijital',
      sectorId: 'commerce',
      status: 'waiting',
      priority: 'normal',
      estimatedValue: 45000,
      lastContactAt: isoDaysFromNow(-22),
      createdAt: isoDaysFromNow(-19),
      note: 'Odeme planina donus bekleniyor.'
    }
  ],
  tasks: [
    {
      id: 't1',
      title: 'Atlas Lojistik fiyat guncellemesi',
      dueDate: isoDaysFromNow(0),
      done: false,
      customerId: 'c1'
    },
    {
      id: 't2',
      title: 'Deniz Proje evrak listesini ara',
      dueDate: isoDaysFromNow(-1),
      done: false,
      customerId: 'c2'
    },
    {
      id: 't3',
      title: 'Mert Yapi teklif PDF kontrolu',
      dueDate: isoDaysFromNow(2),
      done: false,
      customerId: 'c3'
    }
  ],
  invoices: [
    {
      id: 'i1',
      title: 'Atlas sevkiyat faturasi',
      amount: 42000,
      dueDate: isoDaysFromNow(2),
      status: 'pending',
      sectorId: 'transport'
    },
    {
      id: 'i2',
      title: 'Mert Yapi malzeme hak edisi',
      amount: 31000,
      dueDate: isoDaysFromNow(-3),
      status: 'overdue',
      sectorId: 'construction'
    }
  ],
  expenses: [
    {
      id: 'e1',
      title: 'Yakıt gideri',
      vendor: 'Shell',
      amount: 6200,
      paid: false,
      sectorId: 'transport'
    },
    {
      id: 'e2',
      title: 'Ofis yazilim aboneligi',
      vendor: 'SaaS',
      amount: 1800,
      paid: false,
      sectorId: 'consulting'
    }
  ],
  documents: [
    {
      id: 'd1',
      title: 'K belgesi',
      vehiclePlate: '34 MB 013',
      expiryDate: isoDaysFromNow(12),
      sectorId: 'transport'
    },
    {
      id: 'd2',
      title: 'Is guvenligi sertifikasi',
      vehiclePlate: '',
      expiryDate: isoDaysFromNow(27),
      sectorId: 'construction'
    }
  ],
  activities: [
    { id: 'a1', title: 'Atlas arandi', createdAt: isoDaysFromNow(-1) },
    { id: 'a2', title: 'Mert teklif gonderildi', createdAt: isoDaysFromNow(-2) },
    { id: 'a3', title: 'Nova odeme notu', createdAt: isoDaysFromNow(-5) }
  ]
};

const formatMoney = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(value || 0);

const daysUntil = (value) => {
  if (!value) return 9999;
  return Math.ceil((new Date(value).getTime() - Date.now()) / DAY);
};

const shortDate = (value) =>
  new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short'
  });

export default function App() {
  const [data, setData] = useState(seedData);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [customerName, setCustomerName] = useState('');
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setData(JSON.parse(saved));
        }
      } catch {
        setData(seedData);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, loaded]);

  const metrics = useMemo(() => {
    const customers = data.customers;
    const hot = customers.filter((customer) => customer.priority === 'hot');
    const weekAgo = Date.now() - 7 * DAY;
    const newThisWeek = customers.filter(
      (customer) => new Date(customer.createdAt).getTime() >= weekAgo
    );
    const pipeline = customers
      .filter((customer) => !['won', 'lost'].includes(customer.status))
      .reduce((sum, customer) => sum + Number(customer.estimatedValue || 0), 0);

    return [
      { label: 'Toplam musteri', value: customers.length, hint: `${data.sectors.length} sektor` },
      { label: 'Sicak firsat', value: hot.length, hint: hot.length ? 'Aktif' : 'Bekliyor' },
      { label: 'Bu hafta', value: newThisWeek.length, hint: 'Yeni kayit' },
      { label: 'Pipeline', value: formatMoney(pipeline), hint: 'Toplam', dark: true }
    ];
  }, [data]);

  const reminders = useMemo(() => {
    const invoices = data.invoices
      .map((invoice) => ({ ...invoice, days: daysUntil(invoice.dueDate) }))
      .filter((invoice) => ['pending', 'overdue'].includes(invoice.status) && invoice.days <= 7)
      .sort((a, b) => a.days - b.days);
    const documents = data.documents
      .map((document) => ({ ...document, days: daysUntil(document.expiryDate) }))
      .filter((document) => document.days <= 30)
      .sort((a, b) => a.days - b.days);
    const expenses = data.expenses.filter((expense) => !expense.paid);

    return { invoices, documents, expenses };
  }, [data]);

  const openTasks = data.tasks.filter((task) => !task.done);
  const forgottenCustomers = data.customers.filter((customer) => {
    return Date.now() - new Date(customer.lastContactAt).getTime() > 14 * DAY;
  });

  const activityBars = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const end = date.getTime() + DAY;
      const count = data.activities.filter((activity) => {
        const stamp = new Date(activity.createdAt).getTime();
        return stamp >= date.getTime() && stamp < end;
      }).length;

      return {
        label: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        count
      };
    });
  }, [data.activities]);

  const maxActivity = Math.max(1, ...activityBars.map((item) => item.count));

  const toggleTask = (id) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    }));
  };

  const addCustomer = () => {
    const name = customerName.trim();
    if (!name) return;

    setData((current) => ({
      ...current,
      customers: [
        {
          id: `c-${Date.now()}`,
          name,
          company: '',
          sectorId: current.sectors[0].id,
          status: 'waiting',
          priority: 'normal',
          estimatedValue: 0,
          lastContactAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          note: 'Yeni musteri.'
        },
        ...current.customers
      ],
      activities: [
        { id: `a-${Date.now()}`, title: `${name} eklendi`, createdAt: new Date().toISOString() },
        ...current.activities
      ]
    }));
    setCustomerName('');
  };

  const addTask = () => {
    const title = taskTitle.trim();
    if (!title) return;

    setData((current) => ({
      ...current,
      tasks: [
        {
          id: `t-${Date.now()}`,
          title,
          dueDate: new Date().toISOString(),
          done: false,
          customerId: null
        },
        ...current.tasks
      ]
    }));
    setTaskTitle('');
  };

  const resetDemo = () => {
    setData(seedData);
    setCustomerName('');
    setTaskTitle('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>MB Takip</Text>
          <Text style={styles.topSub}>Sektor bazli komuta paneli</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL('https://earsivportal.efatura.gov.tr/intragiris.html')}
          style={styles.portalButton}
        >
          <Text style={styles.portalText}>GIB</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {[
          ['dashboard', 'Panel'],
          ['customers', 'Musteri'],
          ['tasks', 'Gorev'],
          ['finance', 'Finans']
        ].map(([key, label]) => (
          <Pressable
            accessibilityRole="button"
            key={key}
            onPress={() => setTab(key)}
            style={[styles.tab, tab === key && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === key && styles.activeTabText]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {tab === 'dashboard' && (
          <>
            <Hero />
            <SectorGrid sectors={data.sectors} customers={data.customers} />
            <View style={styles.metricsGrid}>
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </View>
            <ReminderPanel reminders={reminders} />
            <TaskPanel tasks={openTasks} onToggle={toggleTask} />
            <ActivityPanel bars={activityBars} max={maxActivity} />
            <SectorDistribution sectors={data.sectors} customers={data.customers} />
            <ForgottenPanel customers={forgottenCustomers} />
          </>
        )}

        {tab === 'customers' && (
          <CustomersScreen
            customerName={customerName}
            customers={data.customers}
            onAdd={addCustomer}
            sectors={data.sectors}
            setCustomerName={setCustomerName}
          />
        )}

        {tab === 'tasks' && (
          <TasksScreen
            onAdd={addTask}
            onToggle={toggleTask}
            setTaskTitle={setTaskTitle}
            taskTitle={taskTitle}
            tasks={data.tasks}
          />
        )}

        {tab === 'finance' && (
          <FinanceScreen
            documents={data.documents}
            expenses={data.expenses}
            invoices={data.invoices}
          />
        )}

        <Pressable accessibilityRole="button" onPress={resetDemo} style={styles.resetButton}>
          <Text style={styles.resetText}>Demo veriyi sifirla</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Hero() {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Yonetim Paneli</Text>
      <Text style={styles.heroTitle}>Komuta Merkezi</Text>
      <Text style={styles.heroText}>
        Bugun ne yapman lazim, hangi musteri sicak, hangi evrak/fatura yaklasiyor:
        tek ekranda takip et.
      </Text>
    </View>
  );
}

function SectorGrid({ sectors, customers }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sektorler · Hizli gecis</Text>
        <Text style={styles.sectionMeta}>{sectors.length} alan</Text>
      </View>
      <View style={styles.sectorGrid}>
        {sectors.map((sector) => {
          const count = customers.filter((customer) => customer.sectorId === sector.id).length;
          return (
            <View key={sector.id} style={styles.sectorCard}>
              <View style={[styles.sectorStripe, { backgroundColor: sector.color }]} />
              <View style={[styles.sectorIcon, { backgroundColor: `${sector.color}20` }]}>
                <Text style={[styles.sectorIconText, { color: sector.color }]}>
                  {sector.icon}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.sectorName}>
                {sector.name}
              </Text>
              <Text style={styles.sectorCount}>{count} musteri</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MetricCard({ label, value, hint, dark }) {
  return (
    <View style={[styles.metricCard, dark && styles.metricCardDark]}>
      <Text style={[styles.metricLabel, dark && styles.metricTextMuted]}>{label}</Text>
      <Text style={[styles.metricValue, dark && styles.metricValueDark]}>{value}</Text>
      <Text style={[styles.metricHint, dark && styles.metricHintDark]}>{hint}</Text>
    </View>
  );
}

function ReminderPanel({ reminders }) {
  const total =
    reminders.invoices.length + reminders.documents.length + reminders.expenses.length;
  if (!total) return null;

  return (
    <View style={styles.warningPanel}>
      <Text style={styles.panelTitle}>Akilli Hatirlaticilar</Text>
      <Text style={styles.panelSub}>
        Vadesi yakin faturalar, biten belgeler, odenmemis giderler
      </Text>
      <ReminderColumn
        empty="Yakin vade yok"
        items={reminders.invoices.map((item) => ({
          id: item.id,
          title: item.title,
          meta: formatMoney(item.amount),
          badge: item.days <= 0 ? `${Math.abs(item.days)} gun gecti` : `${item.days} gun kaldi`,
          danger: item.days <= 0
        }))}
        title="Vadesi yakin fatura"
      />
      <ReminderColumn
        empty="Yaklasan belge yok"
        items={reminders.documents.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.vehiclePlate || 'Belge',
          badge: item.days <= 0 ? `${Math.abs(item.days)} gun gecti` : `${item.days} gun`,
          danger: item.days <= 0
        }))}
        title="Biten belgeler"
      />
      <ReminderColumn
        empty="Tumu odendi"
        items={reminders.expenses.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.vendor,
          badge: formatMoney(item.amount)
        }))}
        title="Odenmemis gider"
      />
    </View>
  );
}

function ReminderColumn({ title, items, empty }) {
  return (
    <View style={styles.reminderColumn}>
      <Text style={styles.reminderTitle}>{title}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>{empty}</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.reminderRow}>
            <View style={styles.flex}>
              <Text numberOfLines={1} style={styles.reminderName}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.reminderMeta}>
                {item.meta}
              </Text>
            </View>
            <Text style={[styles.badge, item.danger && styles.badgeDanger]}>{item.badge}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function TaskPanel({ tasks, onToggle }) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gunluk Gorevler</Text>
        <Text style={styles.sectionMeta}>{tasks.length} acik</Text>
      </View>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>Bekleyen gorev yok.</Text>
      ) : (
        tasks.slice(0, 6).map((task) => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.done }}
            key={task.id}
            onPress={() => onToggle(task.id)}
            style={styles.taskRow}
          >
            <View style={[styles.checkBox, task.done && styles.checkBoxDone]}>
              <Text style={styles.checkBoxText}>{task.done ? 'OK' : ''}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDate, daysUntil(task.dueDate) < 0 && styles.dangerText]}>
                {shortDate(task.dueDate)}
                {daysUntil(task.dueDate) < 0 ? ' · gecikmis' : ''}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

function ActivityPanel({ bars, max }) {
  const total = bars.reduce((sum, item) => sum + item.count, 0);
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>7 Gunluk Aktivite</Text>
        <Text style={styles.sectionMeta}>{total} etkinlik</Text>
      </View>
      <View style={styles.barChart}>
        {bars.map((bar) => (
          <View key={bar.label} style={styles.barItem}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${Math.max(8, (bar.count / max) * 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{bar.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SectorDistribution({ sectors, customers }) {
  const total = Math.max(1, customers.length);
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Sektorel Dagilim</Text>
      {sectors.map((sector) => {
        const count = customers.filter((customer) => customer.sectorId === sector.id).length;
        const percent = Math.round((count / total) * 100);
        return (
          <View key={sector.id} style={styles.distributionRow}>
            <Text numberOfLines={1} style={styles.distributionLabel}>
              {sector.name}
            </Text>
            <View style={styles.distributionTrack}>
              <View
                style={[
                  styles.distributionFill,
                  { width: `${percent}%`, backgroundColor: sector.color }
                ]}
              />
            </View>
            <Text style={styles.distributionPercent}>{percent}%</Text>
          </View>
        );
      })}
    </View>
  );
}

function ForgottenPanel({ customers }) {
  if (!customers.length) return null;

  return (
    <View style={styles.warningPanelSoft}>
      <Text style={styles.sectionTitle}>Unutulmus Musteriler</Text>
      <Text style={styles.panelSub}>14+ gun temas yok</Text>
      {customers.slice(0, 5).map((customer) => (
        <View key={customer.id} style={styles.customerRow}>
          <View style={styles.flex}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerMeta}>{customer.company || customer.note}</Text>
          </View>
          <Text style={styles.badgeDanger}>
            {Math.floor((Date.now() - new Date(customer.lastContactAt).getTime()) / DAY)} gun
          </Text>
        </View>
      ))}
    </View>
  );
}

function CustomersScreen({ customers, sectors, customerName, setCustomerName, onAdd }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Musteriler</Text>
      <InputRow
        buttonLabel="Ekle"
        onChangeText={setCustomerName}
        onPress={onAdd}
        placeholder="Yeni musteri adi"
        value={customerName}
      />
      {customers.map((customer) => {
        const sector = sectors.find((item) => item.id === customer.sectorId);
        return (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.customerTop}>
              <View>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerMeta}>
                  {sector?.name || 'Sektor'} · {customer.company || 'Firma yok'}
                </Text>
              </View>
              <Text style={[styles.badge, customer.priority === 'hot' && styles.hotBadge]}>
                {customer.priority === 'hot' ? 'sicak' : customer.status}
              </Text>
            </View>
            <Text style={styles.noteText}>{customer.note}</Text>
            <Text style={styles.moneyText}>{formatMoney(customer.estimatedValue)}</Text>
          </View>
        );
      })}
    </View>
  );
}

function TasksScreen({ tasks, taskTitle, setTaskTitle, onAdd, onToggle }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Gorevler</Text>
      <InputRow
        buttonLabel="Ekle"
        onChangeText={setTaskTitle}
        onPress={onAdd}
        placeholder="Yeni gorev"
        value={taskTitle}
      />
      {tasks.map((task) => (
        <Pressable key={task.id} onPress={() => onToggle(task.id)} style={styles.taskListCard}>
          <View style={[styles.checkBox, task.done && styles.checkBoxDone]}>
            <Text style={styles.checkBoxText}>{task.done ? 'OK' : ''}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={[styles.taskTitle, task.done && styles.doneText]}>{task.title}</Text>
            <Text style={styles.taskDate}>{shortDate(task.dueDate)}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function FinanceScreen({ invoices, expenses, documents }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Finans ve Evrak</Text>
      <FinanceGroup
        rows={invoices.map((item) => ({
          id: item.id,
          title: item.title,
          meta: `${formatMoney(item.amount)} · ${shortDate(item.dueDate)}`,
          badge: item.status
        }))}
        title="Faturalar"
      />
      <FinanceGroup
        rows={expenses.map((item) => ({
          id: item.id,
          title: item.title,
          meta: `${item.vendor} · ${formatMoney(item.amount)}`,
          badge: item.paid ? 'odendi' : 'bekliyor'
        }))}
        title="Giderler"
      />
      <FinanceGroup
        rows={documents.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.vehiclePlate || 'Belge',
          badge: `${daysUntil(item.expiryDate)} gun`
        }))}
        title="Belgeler"
      />
    </View>
  );
}

function FinanceGroup({ title, rows }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map((row) => (
        <View key={row.id} style={styles.financeRow}>
          <View style={styles.flex}>
            <Text style={styles.customerName}>{row.title}</Text>
            <Text style={styles.customerMeta}>{row.meta}</Text>
          </View>
          <Text style={styles.badge}>{row.badge}</Text>
        </View>
      ))}
    </View>
  );
}

function InputRow({ value, onChangeText, placeholder, onPress, buttonLabel }) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={onPress}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        returnKeyType="done"
        style={styles.input}
        value={value}
      />
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.addButton}>
        <Text style={styles.addText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7fb'
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  brand: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900'
  },
  topSub: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  portalButton: {
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 58
  },
  portalText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900'
  },
  tabs: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 6,
    padding: 10
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    minHeight: 36,
    justifyContent: 'center'
  },
  activeTab: {
    backgroundColor: '#0f172a'
  },
  tabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '900'
  },
  activeTabText: {
    color: '#ffffff'
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginBottom: 18,
    padding: 20
  },
  eyebrow: {
    color: '#5eead4',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 8
  },
  heroText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21
  },
  section: {
    marginBottom: 18
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  sectionMeta: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  sectorCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 116,
    overflow: 'hidden',
    padding: 12,
    width: '31.6%'
  },
  sectorStripe: {
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  sectorIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    marginBottom: 10,
    width: 34
  },
  sectorIconText: {
    fontSize: 11,
    fontWeight: '900'
  },
  sectorName: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '900'
  },
  sectorCount: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 104,
    padding: 14,
    width: '48.4%'
  },
  metricCardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a'
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  metricTextMuted: {
    color: '#94a3b8'
  },
  metricValue: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 14
  },
  metricValueDark: {
    color: '#ffffff',
    fontSize: 21
  },
  metricHint: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3
  },
  metricHintDark: {
    color: '#5eead4'
  },
  warningPanel: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14
  },
  warningPanelSoft: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  panelTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '900'
  },
  panelSub: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 3
  },
  reminderColumn: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 8,
    padding: 10
  },
  reminderTitle: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  reminderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 7
  },
  reminderName: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800'
  },
  reminderMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2
  },
  badge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    color: '#475569',
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  hotBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d'
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    paddingVertical: 12,
    textAlign: 'center'
  },
  taskRow: {
    alignItems: 'center',
    borderLeftColor: '#14b8a6',
    borderLeftWidth: 2,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10
  },
  taskListCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14
  },
  checkBox: {
    alignItems: 'center',
    borderColor: '#94a3b8',
    borderRadius: 6,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28
  },
  checkBoxDone: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6'
  },
  checkBoxText: {
    color: '#042f2e',
    fontSize: 9,
    fontWeight: '900'
  },
  taskTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800'
  },
  taskDate: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3
  },
  dangerText: {
    color: '#dc2626'
  },
  barChart: {
    flexDirection: 'row',
    gap: 8,
    height: 156
  },
  barItem: {
    alignItems: 'center',
    flex: 1
  },
  barTrack: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%'
  },
  barFill: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%'
  },
  barLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase'
  },
  distributionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  distributionLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    width: 82
  },
  distributionTrack: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    flex: 1,
    height: 8,
    overflow: 'hidden'
  },
  distributionFill: {
    borderRadius: 999,
    height: '100%'
  },
  distributionPercent: {
    color: '#0f172a',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    width: 34
  },
  customerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8
  },
  customerCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14
  },
  customerTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  customerName: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900'
  },
  customerMeta: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3
  },
  noteText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10
  },
  moneyText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10
  },
  screenTitle: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0f172a',
    flex: 1,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18
  },
  addText: {
    color: '#042f2e',
    fontSize: 14,
    fontWeight: '900'
  },
  financeRow: {
    alignItems: 'center',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12
  },
  resetButton: {
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    padding: 12
  },
  resetText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '900'
  },
  doneText: {
    color: '#94a3b8',
    textDecorationLine: 'line-through'
  },
  flex: {
    flex: 1
  }
});
