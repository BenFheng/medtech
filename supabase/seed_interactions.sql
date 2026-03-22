-- Seed supplement interaction data
-- This uses product names to look up IDs. Run after seed_products.sql.
-- 20 synergy pairs + 10 antagonism pairs from SUPPLEMENT_INTERACTIONS.md

-- Helper: create a temp function to insert interactions by product name
DO $$
DECLARE
  v_id_a UUID;
  v_id_b UUID;
BEGIN

  -- === SYNERGY PAIRS (20) ===

  -- 1. Vitamin D3 + K2 MK-7
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Vitamin D3' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Vitamin K2 MK-7' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'D3 promotes calcium absorption; K2 directs calcium to bones, away from arteries', 'Take together with a fat-containing meal', 'Strong (multiple clinical trials)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 2. Vitamin C + Collagen Peptides
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Vitamin C Liposomal' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name LIKE 'Collagen Peptides%' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Vitamin C is essential cofactor for collagen synthesis (hydroxylation)', 'Take together for maximum collagen production', 'Strong (biochemical necessity)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 3. NMN + Trans-Resveratrol
  SELECT product_id INTO v_id_a FROM public.products WHERE name LIKE 'NMN%' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Trans-Resveratrol' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'NMN provides NAD+; Resveratrol activates sirtuins that consume NAD+', 'Take together in the morning', 'Moderate (complementary pathways)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 4. NMN + CoQ10
  SELECT product_id INTO v_id_a FROM public.products WHERE name LIKE 'NMN%' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'CoQ10 Ubiquinol' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Combined cardiovascular benefits stronger than either alone', 'Take together with fat-containing meal', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 5. CoQ10 + PQQ
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'CoQ10 Ubiquinol' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name LIKE 'PQQ%' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'PQQ promotes mitochondrial biogenesis; CoQ10 supports mitochondrial function', 'Take together in the morning with food', 'Moderate (mechanistic + early clinical)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 6. CoQ10 + Omega-3
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'CoQ10 Ubiquinol' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Omega-3 EPA/DHA' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Fish oil enhances CoQ10 absorption; complementary cardiovascular support', 'Take together — omega-3 provides fat vehicle for CoQ10', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 7. Astaxanthin + Omega-3
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Astaxanthin' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Omega-3 EPA/DHA' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Synergistic antioxidant effects; astaxanthin protects omega-3s from oxidation', 'Take together with fat-containing meal', 'Moderate (in vivo and in vitro)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 8. Alpha-GPC + L-Theanine
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Alpha-GPC' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'L-Theanine' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Cholinergic boost + GABAergic calm = focused clarity without jitters', 'Take together before cognitive work', 'Moderate (clinical trial)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 9. Lion's Mane + Bacopa
  SELECT product_id INTO v_id_a FROM public.products WHERE name LIKE 'Lion''s Mane%' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Bacopa Monnieri' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Complementary neuroprotection + neurogenesis + memory consolidation', 'Take together; effects build over 4-6 weeks', 'Moderate (mechanistic)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 10. Magnesium + Vitamin D3
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Vitamin D3' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Magnesium required for D3 activation; D3 may improve Mg absorption', 'Both essential; can be taken at different times of day', 'Strong (biochemical)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 11. Magnesium + B6 (B-Complex)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'B-Complex Methylated' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'B6 enhances intracellular magnesium transport', 'B-Complex AM, Magnesium PM', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 12. Selenium + Vitamin D3
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Selenium' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Vitamin D3' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Both essential for thyroid function; selenium supports deiodinase enzymes', 'Take together with food', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 13. Rhodiola + Cordyceps
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Rhodiola Rosea' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Cordyceps Militaris' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Synergistic endurance and athletic performance support', 'Take both 30 min before exercise', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 14. Phytoceramides + Hyaluronic Acid
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Phytoceramides' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Hyaluronic Acid' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Ceramides seal moisture barrier; HA attracts and retains moisture', 'Take together with a meal', 'Moderate (mechanistic)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 15. Glycine + Magnesium
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Glycine' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Complementary sleep support via different mechanisms', 'Take both 60 min before bed', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 16. Phosphatidylserine + Omega-3
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Phosphatidylserine' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Omega-3 EPA/DHA' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Complementary cell membrane phospholipid support', 'Take together with food', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 17. Ashwagandha + Magnesium
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Ashwagandha KSM-66' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Ashwagandha lowers cortisol via HPA axis; magnesium promotes GABAergic relaxation', 'Take both in the evening', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 18. Rhodiola + Creatine
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Rhodiola Rosea' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Creatine Monohydrate' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Rhodiola reduces perceived exertion while creatine boosts phosphocreatine stores', 'Rhodiola before exercise, creatine post-workout', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 19. Apigenin + Magnesium
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Apigenin' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'Apigenin modulates GABA-A receptors while magnesium supports overall GABAergic tone', 'Take both before bed', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 20. L-Tryptophan + B-Complex
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'L-Tryptophan' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'B-Complex Methylated' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'synergy', 'B6 (as P5P) is a required cofactor for converting tryptophan to serotonin', 'B-Complex AM, Tryptophan PM', 'Strong (biochemical)')
    ON CONFLICT DO NOTHING;
  END IF;


  -- === ANTAGONISM PAIRS (10) ===

  -- 1. Zinc vs Magnesium
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Zinc Picolinate' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Magnesium Bisglycinate' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'antagonism', 'High-dose magnesium and zinc compete for absorption via shared intestinal transporters', 'Take at least 2 hours apart (Zinc AM, Magnesium PM)', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 2. Ashwagandha vs Rhodiola
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Ashwagandha KSM-66' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Rhodiola Rosea' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'antagonism', 'Both are potent adaptogens acting on the HPA axis; concurrent use may cause overstimulation or blunted response', 'Use one at a time, or Rhodiola AM and Ashwagandha PM', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Zinc vs Selenium (caution)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Zinc Picolinate' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Selenium' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'caution', 'Antagonistic absorption at certain concentrations', 'Separate by 2+ hours if taking high doses', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 4. Zinc vs Copper (auto-include rule)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Zinc Picolinate' LIMIT 1;
  IF v_id_a IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_a, 'caution', 'High zinc induces metallothionein that sequesters copper, risking copper deficiency', 'Supplement 1-2mg copper if taking >25mg zinc long-term', 'Strong')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Calcium vs Magnesium (caution — informational, no calcium product in DB)
  -- Skipped: no calcium product in the supplement database

  -- 6. Vitamin C vs Selenium (caution at very high doses)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Vitamin C Liposomal' LIMIT 1;
  SELECT product_id INTO v_id_b FROM public.products WHERE name = 'Selenium' LIMIT 1;
  IF v_id_a IS NOT NULL AND v_id_b IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_b, 'caution', 'Very high dose vitamin C may reduce selenite to elemental selenium, impairing absorption', 'Use selenomethionine form (already in our Selenium product) to avoid', 'Low')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 7. Omega-3 vs Blood thinners (safety flag)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Omega-3 EPA/DHA' LIMIT 1;
  IF v_id_a IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_a, 'caution', 'Omega-3 at therapeutic doses (>2g EPA+DHA) may potentiate anticoagulant effects of blood thinners', 'Consult physician if on warfarin, aspirin, or other anticoagulants', 'Strong')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 8. L-Tryptophan vs SSRIs (hard block)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'L-Tryptophan' LIMIT 1;
  IF v_id_a IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_a, 'antagonism', 'CRITICAL: L-Tryptophan combined with SSRIs/SNRIs/MAOIs risks serotonin syndrome (potentially life-threatening)', 'Do NOT combine with SSRIs, SNRIs, or MAOIs', 'Strong (case reports)')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 9. Vitamin K2 vs Warfarin (hard block)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Vitamin K2 MK-7' LIMIT 1;
  IF v_id_a IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_a, 'antagonism', 'CRITICAL: K2 directly opposes warfarin anticoagulant mechanism', 'Do NOT supplement without physician supervision if on anticoagulants', 'Strong')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 10. Ashwagandha vs Thyroid medications (caution)
  SELECT product_id INTO v_id_a FROM public.products WHERE name = 'Ashwagandha KSM-66' LIMIT 1;
  IF v_id_a IS NOT NULL THEN
    INSERT INTO public.supplement_interactions (supplement_a, supplement_b, interaction_type, mechanism, recommendation, evidence_level)
    VALUES (v_id_a, v_id_a, 'caution', 'Ashwagandha may increase thyroid hormone levels; risk of hyperthyroidism', 'Monitor closely or avoid if on levothyroxine or other thyroid medications', 'Moderate')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
